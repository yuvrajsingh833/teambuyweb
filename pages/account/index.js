import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'

import ProductCard from "../../component/productCard";
import CategoryCard from "../../component/categoryCard";
import Loader from '../../component/loader'
import Feature from '../../component/feature';

import * as MasterService from "../../services/master";

import * as Enums from '../../lib/enums'
import * as Utils from "../../lib/utils"

import { Config } from '../../config/appConfig';
import PromotionalOffers from "../../component/promotionalOffers";
import AccountSideBar from "../../component/accountSidebar";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function MyAccount(props) {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userData)

    const [isLoading, setIsLoading] = useState(true);

    const [dashboardData, setDashboardData] = useState([])
    const [featuredCategories, setFeaturedCategories] = useState([])

    const getDashboard = () => {
        MasterService.dashboard({ userType: 'customer' }).then(response => {
            let allFeatureCategory = JSON.parse(JSON.stringify(response.data.featuredCategories))
            allFeatureCategory.sort((a, b) => b.categoryID - a.categoryID);

            setFeaturedCategories(allFeatureCategory)
            setDashboardData(response.data)
            setIsLoading(false)
        }).catch(e => {
            console.log(`getDashboard error : ${e}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getDashboard()

    }, [props]);



    if (isLoading) return <Loader />

    return (
        <>
            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a>Home</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a >My account</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Update Profile</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="common-wrap ptb-40">
                <div className="container">
                    <div className="common-flex d-flex">
                        <div className="common-left">
                            <a style={{ cursor: 'pointer' }} className="mob-profile-menu"></a>
                            <div className="lm-overflow-bg"></div>
                            <div className="left-menu-box">
                                <AccountSideBar />
                            </div>
                        </div>

                        <div className="common-right">
                            <div className="white-box pd-15">
                                <div className="d-inline-flex align-items-center user-info-flex pl-10">
                                    <div className="user-img">
                                        <img src="img/user-img.jpg" />
                                        <div className="upload-icon">
                                            <input onChange={() => { }} type="file" />
                                        </div>
                                    </div>
                                    <div className="user-info">
                                        <div className="xs-heading font-15">Jhon Deo</div>
                                        <div className="xs-heading gray-text">+91 96545 23256</div>
                                    </div>
                                </div>
                                <form className="custom-form mt-60">
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-6">
                                            <div className="form-group pos-rel mb-4">
                                                <input onChange={() => { }} type="text" className="form-control" value="Jhon Deo" />
                                                <span className="form-icon user-icon"></span>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6">
                                            <div className="form-group pos-rel mb-4">
                                                <input onChange={() => { }} type="text" className="form-control" placeholder="Enter your mobile number" />
                                                <span className="form-icon phone-icon"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-6">
                                            <div className="form-group pos-rel mb-4">
                                                <input onChange={() => { }} type="text" className="form-control" value="jhondeo@gmail.com" />
                                                <span className="form-icon email-icon"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <button className="green-btn">UPDATE profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )
}