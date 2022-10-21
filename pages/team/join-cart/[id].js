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
import * as Dates from "../../../lib/dateFormatService"
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
    const [timeDifferencePercent, setTimeDifferencePercent] = useState(0)

    const fetchTeamInfo = () => {
        TeamService.teamInfo({ teamCode: id }).then(response => {
            let teamInfo = response.data.detail

            let timeStamp = Dates.getUTCTimestamp(new Date())
            let startTime = timeStamp - Number(teamInfo.created_at)
            let endTime = Number(teamInfo.expires_at) - Number(teamInfo.created_at)
            setTimeDifferencePercent((startTime / endTime) * 100)

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

    const proceedToCheckout = () => {
        Utils.saveStateAsyncStorage({ "discount": Number(teamInfo.detail.member_off_price), "type": "memberCart" }, "teamBuyCart")
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
                    {(teamInfo.members.length - 1) >= Number(teamInfo.detail.team_min_member) ?
                        <div className="sm-heading mt-6">{Utils.getLanguageLabel("Minimum members joined the team, but still member can join")}</div> :
                        <div className="sm-heading mt-6">{Number(teamInfo.detail.team_min_member - (teamInfo.members.length - 1))} {Utils.getLanguageLabel("member yet to join, but still you can place your order to avail discount of")} <span className="green-text  fw-700">{Utils.convertToPriceFormat(teamInfo.detail.leader_off_price)}</span>
                        </div>
                    }
                </div>
            </section>}

            {(100 - timeDifferencePercent) < 0 && <section className="nearby-wrap mt-30">
                <div className="container">
                    <div className="sm-heading mt-6">{Utils.getLanguageLabel("Team expired")}</div>
                </div>
            </section>}

            <section className="nearby-wrap ptb-30">
                <div className="container">
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-valuenow={100 - timeDifferencePercent} aria-valuemin="0" aria-valuemax="100" style={{ width: `${100 - timeDifferencePercent}%` }}>
                            <span className="sr-only">{Utils.getLanguageLabel("Team expires")} {Dates.calculateRemainingTime(teamInfo.detail.expires_at)}</span>
                        </div>
                    </div>
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
                                <div className="circle-box  team-circle">
                                    <Image alt={`${teamMembers.id}_${teamMembers.user_detail.name}`} src={BASE_URL_USER_AVATAR + teamMembers.user_detail.avatar} layout="raw" height={100} width={100} />
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
                        <button onClick={() => proceedToCheckout()} className="green-btn process-checkout-btn mx-2 px-3 ">
                            {Utils.getLanguageLabel("Proceed to checkout")}
                            <Image height={15} width={15} layout="raw" src="/img/white-right-arrow.svg" alt="img/white-right-arrow.svg" />
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}
