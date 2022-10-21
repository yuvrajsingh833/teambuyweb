import dynamic from "next/dynamic";
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RWebShare } from "react-web-share"

import Loader from '../../../component/loader'

import { Config } from '../../../config/config'

import * as Utils from "../../../lib/utils"
import * as Enums from '../../../lib/enums';

import * as TeamService from "../../../services/team"

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function CheckoutOrderStatusDetail(props) {
    const BASE_URL_TEAM_AVATAR = `${Config.BaseURL.fileServer}${Config.FilePath.teamAvatar}`
    const BASE_URL_USER_AVATAR = `${Config.BaseURL.fileServer}${Config.FilePath.userAvatar}`

    const router = useRouter();
    const { id } = router.query
    const [isLoading, setIsLoading] = useState(true);
    const [teamInfo, setTeamInfo] = useState({});

    const fetchTeamInfo = () => {
        TeamService.teamInfo({ teamCode: id }).then(response => {
            setTeamInfo(response.data)
            setIsLoading(false)
        }).catch(e => {
            setIsLoading(false)
            console.log(`updateUserProfileInfo error : ${e}`)
        })
    }

    useEffect(() => {
        fetchTeamInfo()

    }, [props])

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
                                <div className="circle-box">
                                    <img src="/img/nearby-icon1.png" />
                                </div>
                                <div className="xs-heading text-ellipsis">Sameer’s Team</div>
                            </div>
                        })}

                    </OwlCarousel>
                </div>
            </section>
        </>
    )
}
