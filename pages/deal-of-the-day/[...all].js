import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Loader from '../../component/loader';
import ProductCard from '../../component/productCard';
import AuthSideBar from "../../component/authSidebar";
import NoDataFound from '../../component/nodataFound';
import Feature from "../../component/feature";

import * as CategoryService from "../../services/category";

import * as Utils from '../../lib/utils';

export default function DealOFTheDayPage(props) {
    const router = useRouter();
    const { all } = router.query

    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([])

    const getAllProducts = (query) => {
        setIsLoading(true)
        CategoryService.getDealsOfTheDay({ dealID: query[0] }).then(response => {
            setAllProducts(response.data)
            setIsLoading(false)
        }).catch(e => {
            console.log(`getDealsOfTheDay error : ${e}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        all != undefined && getAllProducts(all)
    }, [all, props])


    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Deal of The Day - {all && all[1]} | Teambuy</title>
            </Head>
            <section className="scp-wrap ptb-30 pb-120">
                <div className="container">
                    <div>
                        <div className="d-flex align-items-center scp-header-flex">
                            <div className="d-flex align-items-center">
                                <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link href="/"><a>{Utils.getLanguageLabel("Home")}</a></Link></li>
                                        <li className="breadcrumb-item">{Utils.getLanguageLabel("Deal of The Day")}</li>
                                        <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel(all[1])}</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="ml-auto d-flex align-items-center product-count-filter">
                                <div className="product-count">{Utils.getLanguageLabel("Total")} {allProducts?.length || 0} {Utils.getLanguageLabel("product(s)")}</div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex common-flex mt-30 scp-flex">
                        <div className="common-right" style={{ width: '100%' }}>
                            {allProducts?.length > 0 ?
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