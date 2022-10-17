import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";

import { Config } from '../../../config/config';

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';
import ProductCard from "../../../component/productCard";

import * as Enums from '../../../lib/enums';
import * as Utils from '../../../lib/utils';

import LoaderInline from "../../../component/loaderInline";
import NoDataFound from "../../../component/nodataFound";
import * as CategoryService from "../../../services/category";
import * as ProductService from "../../../services/product";
import AuthSideBar from "../../../component/authSidebar";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function SubCategory(props) {
    const BASE_URL_CATEGORY = `${Config.BaseURL.fileServer}${Config.FilePath.categoryIcon}`
    const BASE_URL_SUB_CATEGORY = `${Config.BaseURL.fileServer}${Config.FilePath.subCategoryIcon}`

    const router = useRouter();
    const { id, name } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [categoryID, setCategoryID] = useState();
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryID, setSubCategoryID] = useState();
    const [subCategoryName, setSubCategoryName] = useState();

    const [allCategories, setAllCategories] = useState([])
    const [allSubCategories, setAllSubCategories] = useState([])

    const [allProducts, setAllProducts] = useState([])
    const [productInfo, setProductInfo] = useState({})

    const [currentPageNo, setCurrentPageNo] = useState(1)

    const getAllProducts = (subCategoryID, page = currentPageNo, loading = true) => {
        setIsLoading(loading)
        ProductService.allProductByCategory({ categoryID: subCategoryID, limit: Config.PageSize, page: page }).then(response => {
            let dataItems = response.data.items

            if (page == 1) {
                setCurrentPageNo(1);
                setAllProducts(dataItems)
            } else {
                setAllProducts(newDataList => ([...newDataList, ...dataItems]))
            }

            setProductInfo(response.data.paginator)
            setIsLoading(false)
            setIsLoadingMore(false)
        }).catch(e => {
            console.log(`allProductByCategory error : ${e}`)
            setIsLoading(false)
            setIsLoadingMore(false)
        })
    }

    const getMoreProducts = () => {
        if (productInfo.hasNextPage) {
            let newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo)
            getAllProducts(subCategoryID, newPageNo, false)
            setIsLoadingMore(true)
        } else {
            setIsLoadingMore(false)
        }
    }

    const getAllSubCategories = (newCategoryID = categoryID) => {
        setIsLoading(true)
        CategoryService.subCategory({ categoryID: newCategoryID }).then(subCategoryResponse => {

            if (subCategoryResponse.data.sub_categories) {
                setAllSubCategories(subCategoryResponse.data.sub_categories)

                if (categoryID != newCategoryID) { setCategoryID(newCategoryID) }

                if (subCategoryResponse.data.sub_categories.length > 0) {
                    setSubCategoryID(subCategoryResponse.data.sub_categories[0]?.id)
                    setSubCategoryName(subCategoryResponse.data.sub_categories[0]?.name)
                    getAllProducts(subCategoryResponse.data.sub_categories[0]?.id)
                } else {
                    setIsLoading(false)
                }
            } else {
                window.location.replace(`../../${router.asPath.split('/')[1]}`)
            }

        }).catch(e => {
            console.log(`subCategory error : ${e}`)
            setIsLoading(false)
        })
    }

    const getAllCategory = (id) => {
        CategoryService.allCategory().then(response => {

            let filteredCategory = response.data.filter(item => { return item.id == id })
            if (filteredCategory.length > 0) setCategoryName(filteredCategory[0]?.name)

            setAllCategories(response.data)
            setCategoryID(id)
            getAllSubCategories(id)
        }).catch(e => {
            console.log(`getAllCategory error : ${e}`)
            setIsLoading(false)
        })
    }
    useEffect(() => {
        setIsLoading(true)

        id != undefined && getAllCategory(id)

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, [props])

    useEffect(() => {
        if (!isLoadingMore) return;
        getMoreProducts();
    }, [isLoadingMore]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight || isLoadingMore) return;
        setIsLoadingMore(true)
    };

    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    const renderCategory = (data) => {
        if (data)
            return data.map(item => {
                return <Link
                    key={`selected_category_item_${item.id}`}
                    passHref
                    href={{
                        pathname: '/category/[id]/[name]',
                        query: { id: item.id, name: Utils.convertToSlug(item.name) },
                    }}
                >
                    <a className="item">
                        <div onClick={() => {
                            setIsLoading(true)
                            getAllSubCategories(item.id)
                        }} className="deal-box purple-box dtd-box" style={{ backgroundColor: item.bg_color_light }}>
                            <div className="scp-img text-center mt-0">
                                <Image
                                    src={BASE_URL_CATEGORY + item?.icon}
                                    alt={item.name}
                                    height={150}
                                    width={150}
                                    style={{ objectFit: 'contain', maxHeight: 60 }}
                                    layout="raw"
                                />
                            </div>
                            <div className="dtd-content">
                                <div className="xs-heading fw-500 text-center">{Utils.getLanguageLabel(item.name)}</div>
                            </div>
                        </div>
                    </a>
                </Link>
            })
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Buy {categoryName} - {subCategoryName} | Teambuy</title>
            </Head>
            <section className="scp-wrap ptb-30 pb-120">
                <div className="container">
                    {/* Top category selection slider */}
                    <OwlCarousel
                        className="scp-slider owl-carousel common-navs mt-20"
                        loop={false}
                        margin={4}
                        nav={true}
                        dots={false}
                        responsiveClass={true}
                        responsive={Enums.OwlCarouselSlider.selectedCategorySlider}
                    >
                        {renderCategory(allCategories)}
                    </OwlCarousel>

                    {/* Category title and filter area */}
                    {allSubCategories.length > 0 ?
                        <div>
                            <div className="d-flex align-items-center scp-header-flex">
                                <div className="d-flex align-items-center">
                                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link href="/"><a>{Utils.getLanguageLabel("Home")}</a></Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel(categoryName)}</li>
                                        </ol>
                                    </nav>
                                </div>
                                <div className="ml-auto d-flex align-items-center product-count-filter">
                                    <div className="product-count">{Utils.getLanguageLabel("Total")} {productInfo.totalItems} {Utils.getLanguageLabel("product(s)")}</div>
                                    {/* <div className="sort-by-block ml-15 d-flex align-items-center">
                                        <div className="sort-label">{Utils.getLanguageLabel("Sort By")}</div>
                                        <div className=" ml-15">
                                            <select className="form-control">
                                                <option>Price Low to High</option>
                                            </select>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="d-flex common-flex mt-30 scp-flex">
                                <div className="sm-heading for-mobile w-100 mb-2">{Utils.getLanguageLabel(categoryName)}</div>
                                {/* Sub category side bar */}
                                <div className="common-left">
                                    <div className="sm-heading for-desktop">{Utils.getLanguageLabel(categoryName)}</div>
                                    <div className="nav flex-column nav-pills mt-20">
                                        {allSubCategories.map(subCategoryItem => {
                                            let activeClass = `nav-link sub-category-nav ${subCategoryItem.id == subCategoryID ? 'active' : ''}`;
                                            return <button onClick={() => {
                                                setSubCategoryID(subCategoryItem.id)
                                                setSubCategoryName(subCategoryItem.name)
                                                getAllProducts(subCategoryItem.id, 1)
                                            }}
                                                key={`list_${categoryName}_${subCategoryItem.name}`} className={activeClass}>
                                                <div className="product-img for-mobile">
                                                    <Image
                                                        src={BASE_URL_SUB_CATEGORY + subCategoryItem.icon}
                                                        alt={subCategoryItem.name}
                                                        height={150}
                                                        width={150}
                                                        style={{ objectFit: 'contain', maxHeight: 60 }}
                                                        layout="raw"
                                                    />
                                                </div>
                                                <div>{Utils.getLanguageLabel(subCategoryItem.name)}</div>
                                                <span className="arrow-right for-desktop"></span>
                                            </button>
                                        })}
                                    </div>
                                </div>

                                {/* Selected sub category product list */}
                                <div className="common-right">
                                    {allProducts.length > 0 ?
                                        <div className="tab-content" >
                                            <div className="tab-pane fade show active">
                                                <div className="product-list d-flex flex-wrap">
                                                    {allProducts.map((item, index) => {
                                                        return <div key={`product_item_${item._id}_${index}`}
                                                            className="item" >
                                                            <ProductCard item={item} showLogin={(value) => { openLogin() }} />
                                                        </div>
                                                    })}
                                                </div>
                                                {isLoadingMore && <LoaderInline />}
                                            </div>
                                        </div> :
                                        <NoDataFound
                                            image="/bgicon/order-placed.png"
                                            title="Oops! Category empty"
                                            subtitle="Please choose another category."
                                        />
                                    }
                                </div>
                            </div>
                        </div> :
                        isLoading ? <Loader /> :
                            <NoDataFound
                                image="/bgicon/order-placed.png"
                                title="Oops! Category empty"
                                subtitle="Please choose another category."
                            />
                    }
                </div>
            </section>
            {showLogin && <AuthSideBar />}
            <Feature />
        </>
    )
}