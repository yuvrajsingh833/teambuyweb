import dynamic from "next/dynamic";
import Head from 'next/head';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Config } from '../../../config/appConfig';
import * as Utils from '../../../lib/utils';
import * as Enums from '../../../lib/enums';
import * as CategoryService from "../../../services/category";
import * as ProductService from "../../../services/product";
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../../component/loader';
import { ProductCard } from "../../../component/productCard";
import Feature from '../../../component/feature';

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function SubCategory(props) {
    const router = useRouter();
    const { id, name } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [categoryID, setCategoryID] = useState();
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryID, setSubCategoryID] = useState();
    const [subCategoryName, setSubCategoryName] = useState();

    const [allCategories, setAllCategories] = useState([])
    const [allSubCategories, setAllSubCategories] = useState([])

    const [allProducts, setAllProducts] = useState([])
    const [productInfo, setProductInfo] = useState({})

    const [currentPageNo, setCurrentPageNo] = useState(1)

    const getAllProducts = (subCategoryID, page = currentPageNo) => {
        ProductService.allProductByCategory({ categoryID: subCategoryID }).then(response => {
            if (page == 1) setCurrentPageNo(1);

            setAllProducts(response.data.items)
            setProductInfo(response.data.paginator)

            setIsLoading(false)
            setIsRefreshing(false)
        }).catch(e => {
            console.log(`getAllProductByCategory error : ${e}`)
            setIsLoading(false)
            setIsRefreshing(false)
        })
    }

    const getAllSubCategories = (newCategoryID = categoryID) => {
        CategoryService.subCategory({ categoryID: newCategoryID }).then(subCategoryResponse => {
            setAllSubCategories(subCategoryResponse.data.sub_categories)

            if (categoryID != newCategoryID) { setCategoryID(newCategoryID) }

            if (subCategoryResponse.data.sub_categories.length > 0) {
                setSubCategoryID(subCategoryResponse.data.sub_categories[0]?.id)
                setSubCategoryName(subCategoryResponse.data.sub_categories[0]?.name)
                getAllProducts(subCategoryResponse.data.sub_categories[0]?.id)
            } else {
                setIsLoading(false)
                setIsRefreshing(false)
            }
        }).catch(e => {
            console.log(`subCategory error : ${e}`)
            setIsLoading(false)
            setIsRefreshing(false)
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
            setIsRefreshing(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        setIsRefreshing(false)
        id != undefined && getAllCategory(id)
    }, [props])

    const renderCategory = (data) => {
        const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.categoryIcon}`
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
                                    src={BASE_URL + item.icon}
                                    alt={item.name}
                                    height={100}
                                    width={100}
                                    layout="raw"
                                    style={{ maxHeight: 60 }}
                                />
                            </div>
                            <div className="dtd-content">
                                <div className="xs-heading fw-500 text-center">{item.name}</div>
                            </div>
                        </div>
                    </a>
                </Link>
            })
    }

    return (
        isLoading ? <Loader /> : <>
            <Head>
                <title>Buy {categoryName} - {subCategoryName} | Teambuy</title>
            </Head>
            <section className="scp-wrap ptb-30 pb-120">
                <div className="container">
                    {/* Top category selection slider */}
                    <OwlCarousel
                        className="scp-slider owl-carousel common-navs mt-20"
                        loop={false}
                        margin={12}
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
                                    <nav className="custom-breadcrumb" aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">{categoryName}</li>
                                        </ol>
                                    </nav>
                                </div>
                                <div className="ml-auto d-flex align-items-center product-count-filter">
                                    <div className="product-count">Total {productInfo.totalItems} product(s)</div>
                                    <div className="sort-by-block ml-15 d-flex align-items-center">
                                        <div className="sort-label">Sort By</div>
                                        <div className=" ml-15">
                                            <select className="form-control">
                                                <option>Price Low to High</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex common-flex mt-30">
                                {/* Sub category side bar */}
                                <div className="common-left">
                                    <div className="sm-heading">{categoryName}</div>
                                    <div className="nav flex-column nav-pills mt-20" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                        {allSubCategories.map(subCategoryItem => {
                                            let activeClass = `nav-link ${subCategoryItem.id == subCategoryID ? 'active' : ''}`;

                                            return <button onClick={() => {
                                                setSubCategoryID(subCategoryItem.id)
                                                setSubCategoryName(subCategoryItem.name)
                                                getAllProducts(subCategoryItem.id, 1)
                                            }} key={`list_${categoryName}_${subCategoryItem.name}`} className={activeClass} id="v-pills-fruits-tab" data-bs-toggle="pill" data-bs-target="#v-pills-fruits" type="button" role="tab" aria-controls={"v-pills-fruits"} aria-selected="true">{subCategoryItem.name} <span className="arrow-right"></span></button>
                                        })}
                                    </div>
                                </div>

                                {/* Selected sub category product list */}
                                <div className="common-right">
                                    {allProducts.length > 0 ?
                                        <div className="tab-content" id="v-pills-tabContent">
                                            <div className="tab-pane fade show active" id={"v-pills-fruits"} role="tabpanel" aria-labelledby="v-pills-fruits-tab">
                                                <div className="product-list d-flex flex-wrap">
                                                    {allProducts.map(item => {
                                                        return <div key={`product_item_${item._id}`}
                                                            className="item" >
                                                            <ProductCard item={item} />
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        </div> : <section className="cart-wrap">
                                            <div className="empty-cart">
                                                <div className="ce-icon text-center">
                                                    <Image
                                                        alt="fail"
                                                        src="/bgicon/order-placed.png"
                                                        height={60}
                                                        width={60}
                                                    />
                                                </div>
                                                <div className="sm-heading text-center mt-30">Oops! Category empty</div>
                                                <div className="xs-heading text-center font-12">Please choose another category.</div>
                                            </div>
                                        </section>}
                                </div>
                            </div>
                        </div> :
                        isLoading ? <Loader /> :
                            <section className="cart-wrap">
                                <div className="empty-cart">
                                    <div className="ce-icon text-center">
                                        <Image
                                            alt="fail"
                                            src="/bgicon/order-placed.png"
                                            height={60}
                                            width={60}
                                        />
                                    </div>
                                    <div className="sm-heading text-center mt-30">Oops! Category empty</div>
                                    <div className="xs-heading text-center font-12">Please choose another category.</div>

                                </div>
                            </section>
                    }
                </div>
            </section>
            <Feature />
        </>
    )
}