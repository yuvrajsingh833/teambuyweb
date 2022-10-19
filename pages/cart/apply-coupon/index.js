import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import router from "next/router";

import Loader from '../../../component/loader';
import Feature from "../../../component/feature";

import * as Utils from "../../../lib/utils";

import * as CheckoutService from "../../../services/checkout";

export default function ApplyCouponPage(props) {
    const couponApplied = Utils.getStateAsyncStorage("appliedCoupon")

    const userData = useSelector(state => state.userData)
    const user = userData?.userData
    global.user = userData?.userData

    const [isLoading, setIsLoading] = useState(true);

    const [appliedCoupon, setAppliedCoupon] = useState((couponApplied && Object.keys(couponApplied).length > 0) ? couponApplied : null);

    const [allCoupons, setAllCoupons] = useState([]);

    const getAllCoupons = () => {
        setIsLoading(true)
        CheckoutService.getAllCoupons().then(response => {
            setAllCoupons(response.data)
            setIsLoading(false)
        }).catch(e => {
            setIsLoading(false)
            console.log(`.getAllCoupons error : ${e}`)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getAllCoupons();
        setAppliedCoupon((couponApplied && Object.keys(couponApplied).length > 0) ? couponApplied : null);
    }, [props])

    const applyCouponPage = (selectedCoupon) => {
        setAppliedCoupon(selectedCoupon)
        Utils.saveStateAsyncStorage(selectedCoupon, "appliedCoupon")
        router.push("/cart");
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Apply Coupon | Teambuy</title>
            </Head>

            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/" }}>
                                    <a>{Utils.getLanguageLabel("Home")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a>{Utils.getLanguageLabel("My account")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/cart" }}>
                                    <a>{Utils.getLanguageLabel("Cart")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Apply Coupon")}</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="apply-coupon-wrap ptb-40">
                <div className="container">
                    <div className="row">
                        {allCoupons.length > 0 && allCoupons.map((item, index) => {
                            return <div key={`coupon_${item.id}_${index}`} className="col-md-6">
                                <div className="white-box coupon-box">
                                    <div className="d-flex align-items-center">
                                        <div className="white-box green-box coupon-code">
                                            <div className="d-flex align-items-center">
                                                <div className="coupon-text text-uppercase">{item.code}</div>
                                            </div>
                                        </div>
                                        <div className="ml-auto">
                                            <a style={{ cursor: 'pointer' }} onClick={() => applyCouponPage(item)} className="green-text xs-heading text-uppercase fw-500">{appliedCoupon?.code == item.code ? "Applied" : "Apply"}</a>
                                        </div>
                                    </div>
                                    <div className="xs-heading fw-500">{item.additional_information}</div>
                                    <div className="sm-content">{item.description}</div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )

}