import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import Loader from '../../component/loader'

import LoaderInline from "../../component/loaderInline";
import ProductCard from '../../component/productCard'

import NoDataFound from '../../component/nodataFound'
import { Config } from "../../config/config"
import * as MasterService from "../../services/master"
import AuthSideBar from "../../component/authSidebar";

import * as Utils from '../../lib/utils'
import Feature from "../../component/feature";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function SearchPage(props) {
    const router = useRouter();
    const { searchText } = router.query;

    const [showLogin, setShowLogin] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [subCategorySelectedRadio, setSubCategorySelectedRadio] = useState(router.query.subCategory || 'all');
    const [categorySelectedRadio, setCategorySelectedRadio] = useState(router.query.category || 'all');
    const [selectedBrandIds, setSelectedBrandIds] = useState(router?.query?.brand?.split(',') || []);
    const [selectedColorCodes, setSelectedColorCodes] = useState(router?.query?.color?.split(',') || []);
    const [selectedPrice, setSelectedPrice] = useState(router?.query?.price?.split(',') || []);
    const [sortByValue, setSortByValue] = useState((router?.query?.sortby && router?.query?.order) ? `${router?.query?.sortby}_${router?.query?.order}` : 'name_asc');


    const [allProducts, setAllProducts] = useState([])
    const [productInfo, setProductInfo] = useState({})

    const [currentPageNo, setCurrentPageNo] = useState(1)

    const getAllProducts = (page = currentPageNo, loading = true) => {
        setIsLoading(loading)
        MasterService.search({ product: searchText, limit: Config.PageSize, page: page }).then(response => {
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
            console.log(`search error : ${e}`)
            setIsLoading(false)
            setIsLoadingMore(false)
        })
    }

    const getMoreProducts = () => {
        if (productInfo.hasNextPage) {
            let newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo)
            getAllProducts(newPageNo, false)
            setIsLoadingMore(true)
        } else {
            setIsLoadingMore(false)
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight || isLoadingMore) return;
        setIsLoadingMore(true)
    };

    useEffect(() => {
        setIsLoading(true)

        searchText != undefined && getAllProducts()

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, [props])

    useEffect(() => {
        if (!isLoadingMore) return;
        getMoreProducts();
    }, [isLoadingMore]);

    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>{searchText} search result | Teambuy</title>
            </Head>
            <section className="scp-wrap ptb-30 pb-120">
                <div className="container">
                    <div>
                        <div className="d-flex align-items-center scp-header-flex">
                            <div className="d-flex align-items-center">
                                <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link href="/"><a>{Utils.getLanguageLabel("Home")}</a></Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Search result for")}{Utils.getLanguageLabel(searchText)}</li>
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
                    </div>
                    <div className="d-flex common-flex mt-30 scp-flex">
                        <div className="common-right" style={{ width: '100%' }}>
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
                                    title="Oops! no item found"
                                    subtitle="Please search other item."
                                />
                            }
                        </div>
                    </div>
                </div>
            </section>
            {showLogin && <AuthSideBar />}
            <Feature />
        </>
    )
}