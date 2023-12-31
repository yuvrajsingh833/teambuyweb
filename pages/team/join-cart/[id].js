import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'react-simple-snackbar';
import { useSelector } from 'react-redux';

import Loader from '../../../component/loader';

import { Config } from '../../../config/config';

import * as Dates from "../../../lib/dateFormatService";
import * as Enums from '../../../lib/enums';
import * as Utils from "../../../lib/utils";

import * as TeamService from "../../../services/team";
import AuthSideBar from "../../../component/authSidebar";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function CheckoutOrderStatusDetail(props) {
    const userData = useSelector(state => state.userData)
    const user = userData?.userData || {}

    const BASE_URL_USER_AVATAR = `${Config.BaseURL.fileServer}${Config.FilePath.userAvatar}`
    const [openSnackbar] = useSnackbar()

    const router = useRouter();
    const { id } = router.query
    const [isLoading, setIsLoading] = useState(true);
    const [teamInfo, setTeamInfo] = useState({});
    const [timeDifferencePercent, setTimeDifferencePercent] = useState(0)
    const [showLogin, setShowLogin] = useState(false)

    const [cartItems, setCartItems] = useState([]);

    const fetchTeamInfo = () => {
        id && TeamService.teamInfo({ teamCode: id }).then(response => {
            let teamInfo = response.data.detail
            let timeStamp = Dates.getUTCTimestamp(new Date())
            let startTime = timeStamp - Number(teamInfo.created_at)
            let endTime = Number(teamInfo.expires_at) - Number(teamInfo.created_at)
            setTimeDifferencePercent((startTime / endTime) * 100)
            setCartItems(response?.data?.cart || [])
            setTeamInfo(response.data)
            setIsLoading(false)
        }).catch(e => {
            setIsLoading(false)
            console.log(`teamInfo error : ${e}`)
        })
    }

    useEffect(() => {
        fetchTeamInfo()
    }, [props])


    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    const joinTheTeam = () => {
        if (user.id) {
            TeamService.joinTeam({ teamCode: id }).then(response => {
                setIsLoading(false)
                Utils.saveStateAsyncStorage({ "discount": Number(teamInfo?.detail?.member_off_price), "type": "memberCart", "teamCode": teamInfo?.detail?.team_code, "teamID": teamInfo?.detail?.id }, "teamBuyCart")
                router.push({ pathname: '/checkout' })
            }).catch(e => {
                setIsLoading(false)
                openSnackbar(e.message)
                console.log(`joinTeam error : ${e}`)
            })
        } else {
            openLogin()
        }
    }

    const renderCart = () => {
        return cartItems.map((item, index) => {
            let productDetail = item.product_info;

            return <div key={`cart_item_${item.id}_${index}`} className="px-2 pd-0 mt-10 col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 desktop-margin-right">
                <div className="cart-main-box white-box">

                    <div className="d-flex to-product-flex align-items-center">
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
                </div>
            </div>
        })
    }


    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Join team {id} | Teambuy</title>
                <meta name="description" content={`Join team ${id} | Teambuy`} />
                <link rel="icon" href="/favicon.ico" />
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
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/cart/join-cart/[id]", query: { id: id } }}>
                                    <a>{Utils.getLanguageLabel("Join Cart")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{teamInfo?.detail?.team_name} ({id})</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {(100 - timeDifferencePercent) > 0 && <section className="nearby-wrap mt-30">
                <div className="container">
                    {(teamInfo?.members?.length - 1) >= Number(teamInfo?.detail?.team_min_member) ?
                        <div className="sm-heading mt-6">{Utils.getLanguageLabel("Minimum members joined the team, but still member can join")}</div> :
                        <div className="sm-heading mt-6">{Number(teamInfo?.detail?.team_min_member - (teamInfo?.members?.length - 1))} {Utils.getLanguageLabel("member yet to join, but still you can place your order to avail discount of")} <span className="green-text  fw-700">{Utils.convertToPriceFormat(teamInfo?.detail?.leader_off_price)}</span>
                        </div>
                    }
                </div>
            </section>}

            {(100 - timeDifferencePercent) < 0 ? <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="progress">
                        <div className="progress-bar progress-bar-error" role="progressbar" aria-valuenow={100} aria-valuemin="0" aria-valuemax="100" style={{ width: `${100}%` }}>
                            <span className="sr-only">{Utils.getLanguageLabel("Team expired")} </span>
                        </div>
                    </div>
                </div>
            </section> : <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-valuenow={100 - timeDifferencePercent} aria-valuemin="0" aria-valuemax="100" style={{ width: `${100 - timeDifferencePercent}%` }}>
                            <span className="sr-only">{Utils.getLanguageLabel("Team will expire")} {Dates.calculateRemainingTime(teamInfo?.detail?.expires_at)}</span>
                        </div>
                    </div>
                </div>
            </section>}

            <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="d-flex align-items-center heading-flex">
                        <div className="sm-heading">{Utils.getLanguageLabel("Members of the team")}</div>
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
                        {teamInfo?.members?.length > 0 && teamInfo?.members.map(teamMembers => {
                            return <div key={`team_member_${teamMembers.id}`} className="item d-flex align-items-center nearby-box">
                                <div className="circle-box  team-circle">
                                    <Image alt={`${teamMembers.id}_${teamMembers.user_detail.name}`} src={(teamMembers.user_detail.avatar != undefined && teamMembers.user_detail.avatar != null && teamMembers.user_detail.avatar != "null") ? BASE_URL_USER_AVATAR + teamMembers.user_detail.avatar : '/img/default-user.png'} layout="raw" height={100} width={100} />
                                </div>
                                <div>
                                    <div className="xs-heading text-ellipsis fw-500">{teamMembers.user_detail.name}</div>
                                    <div className="xs-heading">{teamMembers.leader ? "Team Leader" : "Team Member"}</div>
                                </div>
                            </div>
                        })}

                    </OwlCarousel>
                </div>
            </section>

            <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="d-flex align-items-center heading-flex">
                        <div className="sm-heading">{Utils.getLanguageLabel("Cart items")}</div>
                    </div>

                    <div className="row px-4">
                        {renderCart()}
                    </div>
                </div>
            </section>

            {user.id != teamInfo?.detail?.created_by && <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="d-flex align-items-center heading-flex">
                        <button onClick={() => joinTheTeam()} className="green-btn process-checkout-btn mx-2 px-3 ">
                            {Utils.getLanguageLabel((100 - timeDifferencePercent) < 0 ? "team Expired" : "Join the team")}
                        </button>
                    </div>
                </div>
            </section>}

            {showLogin && <AuthSideBar />}
        </>
    )
}
