import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Loader from '../../../component/loader';

import { Config } from '../../../config/config';
import * as Enums from '../../../lib/enums';
import * as Utils from "../../../lib/utils";
import * as Validations from "../../../lib/validation";

import AuthSideBar from "../../../component/authSidebar";
import Feature from "../../../component/feature";
import * as CheckoutService from "../../../services/checkout";
import * as MasterService from "../../../services/master";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function ShareCartPage(props) {
    const BASE_URL = `${Config.BaseURL.fileServer}${Config.FilePath.teamAvatar}`

    const userData = useSelector(state => state.userData)
    global.user = userData?.userData

    const [teamName, setTeamName] = useState(null);
    const [teamNameError, setTeamNameError] = useState(null);

    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    const [cartItems, setCartItems] = useState([]);
    const [teamAvatar, setTeamAvatar] = useState(null);

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

    const updateTeamAvatar = event => {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            const imageData = new FormData();
            imageData.append("teamAvatar", image);

            // setIsLoading(true)
            // UserService.updateTeamAvatar(imageData).then(response => {
            //     if (response.statusCode != 200) {
            //         setIsLoading(false)
            //         openSnackbar(response.message)
            //     } else {
            //         openSnackbar("Profile image updated successfully", 1000)
            //         getUserInfo()
            //     }
            // }).catch(e => {
            //     setIsLoading(false)
            //     console.log(`updateUserProfileInfo error : ${e}`)
            // })
        }
    };

    const handleCreateTeam = () => {
        let teamNameValidation = Validations.validateField(teamName, { emptyField: 'Team name cannot be empty' })
        let error = {};

        if (teamNameValidation.error) {
            error['teamName'] = teamNameValidation.message
        }
        if (Object.keys(error).length == 0) {
            doCreateTeam()
        } else {
            setTeamNameError(error.teamName)
            return false;
        }
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
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/cart" }}>
                                    <a>{Utils.getLanguageLabel("Cart")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Share Cart")}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {cartItems.length > 0 && <section className="cart-wrap ptb-40">
                <div className="container">
                    <div className="row cart-block">
                        <div className="col-lg-6">
                            <div className="sm-heading list-disc">{Utils.getLanguageLabel("Your cart items")}</div>
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
                                    <div className="d-inline-flex align-items-center user-info-flex pl-10 mt-50">
                                        <div className="user-img">
                                            <Image
                                                alt={teamAvatar ? (BASE_URL + teamAvatar) : '/img/default-user.png'}
                                                height={100}
                                                width={100}
                                                layout="raw"
                                                src={teamAvatar ? (BASE_URL + teamAvatar) : '/img/default-user.png'} />
                                            <div className="upload-icon">
                                                <input onChange={updateTeamAvatar} type="file" accept="image/*" />
                                            </div>
                                        </div>

                                        <form className="custom-form" style={{ marginLeft: '20px' }}>
                                            <div className="form-group pos-rel">
                                                <input onChange={(event) => { setTeamName(event.target.value) }} type="text" className="form-control" value={teamName} placeholder={Utils.getLanguageLabel("Enter your team name")} />
                                                <span className="form-icon user-icon"></span>
                                            </div>
                                            <span style={{ fontSize: '12px', color: '#D83734' }}>{teamNameError}</span>
                                        </form>
                                    </div>
                                    <div className="mt-30">
                                        <button onClick={() => { handleCreateTeam() }} type="button" className="green-btn">{Utils.getLanguageLabel("Create Your Team")}</button>
                                    </div>
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