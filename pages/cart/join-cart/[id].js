import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dynamic from "next/dynamic";

import Loader from '../../../component/loader';

import { Config } from '../../../config/config';
import * as Utils from "../../../lib/utils";
import * as Enums from '../../../lib/enums';

import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import { useRouter } from 'next/router';
import AuthSideBar from "../../../component/authSidebar";
import Feature from "../../../component/feature";
import * as CheckoutService from "../../../services/checkout";
import * as MasterService from "../../../services/master";
import * as PaymentService from "../../../services/payment";
import * as UserService from "../../../services/user";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function ShareCartPage(props) {
    const couponApplied = Utils.getStateAsyncStorage("appliedCoupon")

    const router = useRouter();

    const userData = useSelector(state => state.userData)
    global.user = userData?.userData

    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState((couponApplied && Object.keys(couponApplied).length > 0) ? couponApplied : null);

    const [cartItems, setCartItems] = useState([]);

    const [teambuyOfferPrice, setTeambuyOfferPrice] = useState(0);
    const [teambuyOfferDiscountLeader, setTeambuyOfferDiscountLeader] = useState(0);
    const [teambuyOfferDiscountMember, setTeambuyOfferDiscountMember] = useState(0);


    const getAllCartItems = () => {
        setIsLoading(true)
        CheckoutService.getCart().then(response => {
            let teambuyOfferDiscount = 0;

            response.data.map(mapItems => {
                teambuyOfferDiscount = teambuyOfferDiscount + (mapItems.product_info.teambuy_offer_price * mapItems.quantity)
            })

            setTeambuyOfferPrice(teambuyOfferDiscount)
            setCartItems(response.data)
            setIsLoading(false)
        }).catch(e => {
            console.log(`getCart error : ${e}`)
            setCartItems([])
            setIsLoading(false)
        })
    }

    useEffect(() => {

        setIsLoading(true)
        setCartItems([]);

        MasterService.settings().then(settingResponse => {
            (settingResponse.data).map(settingItem => {
                if (settingItem.key == "teambuy_offer_discount_leader") {
                    setTeambuyOfferDiscountLeader(settingItem.value)
                }

                if (settingItem.key == "teambuy_offer_discount_member") {
                    setTeambuyOfferDiscountMember(settingItem.value)
                }
            })

        }).catch(e => { console.log(`settings error : ${e}`) })

        if (global?.user?.token?.length > 0) {
            getAllCartItems()
        } else {
            openLogin()
        }
    }, [props])

    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    const renderCart = () => {
        return cartItems.map((item, index) => {
            let productDetail = item.product_info;

            return <div key={`cart_item_${item.id}_${index}`} className="d-flex to-product-flex align-items-center">
                <div className="to-product-count fw-700">{index + 1}.</div>
                <div className="product-img">
                    <Image src={Utils.generateProductImage(productDetail)} alt={productDetail?.name} layout="raw" height={200} width={200}
                        className={'common-product-image'} style={{ objectFit: 'contain' }} />
                </div>
                <div className="product-content">
                    <div className="d-flex align-items-center">
                        <div>
                            <div className="xs-heading fw-500 font-12">{productDetail.name}</div>
                            <div className="weight-count">{productDetail.size}</div>
                        </div>
                        <div className="ml-auto">
                            {productDetail.discount > 0 && <div className="product-price"><span
                                className="cut-price">{Utils.convertToPriceFormat(productDetail.gst_amount +
                                    productDetail.price_without_gst)}</span>
                                {Utils.convertToPriceFormat((productDetail.gst_amount + productDetail.price_without_gst -
                                    productDetail.discount) * item.quantity)}</div>}

                            {productDetail.discount < 1 && <div className="product-price">
                                {Utils.convertToPriceFormat((productDetail.gst_amount + productDetail.price_without_gst -
                                    productDetail.discount) * item.quantity)}</div>}
                        </div>
                    </div>
                </div>
            </div>
        })
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Share Cart With Friends & Family | Teambuy</title>
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
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Cart")}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {cartItems.length > 0 && <section className="cart-wrap ptb-40">
                <div className="container">
                    <div className="row cart-block">
                        <div className="col-lg-6">
                            <div className="sm-heading list-disc">{Utils.getLanguageLabel("Order items")}</div>
                            <div className="white-box pd-0 mt-10">
                                <div className="cart-main-box">
                                    {renderCart()}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="sm-heading list-disc">{Utils.getLanguageLabel("Share cart")}</div>
                            <div className="white-box pd-0 mt-10">
                                <div className="cart-main-box">
                                    <div className="sm-heading mt-6">{Utils.getLanguageLabel("Get teambuy discount of ")}<span className="green-text  fw-700">{Utils.convertToPriceFormat((teambuyOfferPrice))}</span>
                                        <br /><br />

                                        {Utils.getLanguageLabel("Get flat")} <span className="green-text  fw-700">{Utils.convertToPriceFormat((teambuyOfferPrice * (teambuyOfferDiscountLeader / 100)))}</span> {Utils.getLanguageLabel("discount when you place order with a team and")} <span className="green-text  fw-700">{Utils.convertToPriceFormat((teambuyOfferPrice * (teambuyOfferDiscountMember / 100)))}</span> {Utils.getLanguageLabel("when your team member place the order")}</div>

                                    {teambuyOfferPrice > 0 && <div className="d-flex align-items-center share-friend-block">
                                        <div>
                                            <div className="xs-heading font-12">{Utils.getLanguageLabel("Create or Join team with friends & family to avail Teambuy price and")}</div>
                                            <div className="sm-heading mt-6">{Utils.getLanguageLabel("Get instant cashback of ")}<span className="green-text  fw-700">{Utils.convertToPriceFormat((teambuyOfferPrice * (teambuyOfferDiscountLeader / 100)))}</span></div>
                                        </div>
                                        <div className="ml-auto">
                                            <FacebookShareButton
                                                url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}
                                                quote={`Hey, join the team and get a huge discount on the purchase`}
                                                hashtag={'#teambuy'}
                                            >
                                                <FacebookIcon size={40} round />
                                            </FacebookShareButton>
                                            <WhatsappShareButton
                                                url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}
                                                title={`Hey, join the team and get a huge discount on the purchase`}
                                                separator=":: "
                                            >
                                                <WhatsappIcon size={40} round />
                                            </WhatsappShareButton>
                                            <TwitterShareButton
                                                url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}
                                                title={`Hey, join the team and get a huge discount on the purchase`}
                                            >
                                                <TwitterIcon size={40} round />
                                            </TwitterShareButton>
                                            <LinkedinShareButton url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}>
                                                <LinkedinIcon size={40} round />
                                            </LinkedinShareButton>

                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="d-flex align-items-center heading-flex">
                        <div className="sm-heading">{Utils.getLanguageLabel("You can select existing nearby team")}</div>
                    </div>

                    <OwlCarousel
                        className="seven-items-slider owl-carousel common-navs mt-20"
                        loop={false}
                        margin={12}
                        nav={true}
                        dots={false}
                        responsiveClass={true}
                        responsive={Enums.OwlCarouselSlider.sevenItemSlider}
                    >
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon1.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Sameer’s Team</div>
                        </div>
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon2.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Rajesh’s Team</div>
                        </div>
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon3.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Rahul’s Team</div>
                        </div>
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon4.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Jayesh’s Team</div>
                        </div>
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon1.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Sameer’s Team</div>
                        </div>
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon2.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Rajesh’s Team</div>
                        </div>
                        <div className="item d-flex align-items-center nearby-box">
                            <div className="circle-box">
                                <img src="/img/nearby-icon3.png" />
                            </div>
                            <div className="xs-heading text-ellipsis">Rahul’s Team</div>
                        </div>
                    </OwlCarousel>
                </div>
            </section>

            {showLogin && <AuthSideBar />}
            <Feature />
        </>
    )

}