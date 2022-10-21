import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RWebShare } from "react-web-share"

import Loader from '../../../../component/loader'

import { Config } from '../../../../config/config'

import * as Utils from "../../../../lib/utils"
import * as TeamService from "../../../../services/team"

export default function CheckoutOrderStatusDetail(props) {
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
                <title>Team created successfully | Teambuy</title>
                <meta name="description" content={`Team created successfully | Teambuy`} />
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
                                <Link passHref href={{ pathname: "/cart/share-cart" }}>
                                    <a>{Utils.getLanguageLabel("Share Cart")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{id}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="cart-wrap ptb-40">
                <div className="container">
                    <div className="text-center cart-success-block">
                        <div className="success-icon">
                            <Image layout='raw' height={120} width={120} quality={100} alt='status-icon' src="/bgicon/confirm.png" />
                        </div>
                        <div className="sm-heading mt-40 text-center">{Utils.getLanguageLabel("Congratulations!! Your team has been created successfully")}</div>

                        <div className="sm-heading mt-6">{Utils.getLanguageLabel("Get teambuy discount of ")}<span className="green-text  fw-700">{Utils.convertToPriceFormat(Number(teamInfo.detail.member_off_price) + Number(teamInfo.detail.leader_off_price))}</span>
                        </div>
                        <div className="xs-heading mt-6">
                            {Utils.getLanguageLabel("Get flat")} <span className="green-text  fw-700">{Utils.convertToPriceFormat(teamInfo.detail.leader_off_price)}</span> {Utils.getLanguageLabel("discount when you place order with a team and")}<br /> <span className="green-text  fw-700">{Utils.convertToPriceFormat(teamInfo.detail.member_off_price)}</span> {Utils.getLanguageLabel("when your team member place the order")}</div>
                        <div className="mt-10 text-center">
                            <div className="sm-heading text-center">{Utils.getLanguageLabel("Share and Add team members")}</div>
                            <div className="ml-auto mt-1">
                                <FacebookShareButton
                                    url={`${Config.BaseURL.web.replace(/\/$/, "")}/team/join-cart/${id})`}
                                    quote={`Hey, join the team "${teamInfo.detail.team_name}" and get a discount of ${Utils.convertToPriceFormat(teamInfo.detail.member_off_price)} on the purchase`}
                                    hashtag={'#teambuy'}
                                >
                                    <FacebookIcon size={40} round />
                                </FacebookShareButton>
                                &nbsp;
                                <WhatsappShareButton
                                    url={`${Config.BaseURL.web.replace(/\/$/, "")}/team/join-cart/${id})`}
                                    title={`Hey, join the team "${teamInfo.detail.team_name}" and get a discount of ${Utils.convertToPriceFormat(teamInfo.detail.member_off_price)} on the purchase`}
                                    separator=":: "
                                >
                                    <WhatsappIcon size={40} round />
                                </WhatsappShareButton>
                                &nbsp;
                                <TwitterShareButton
                                    url={`${Config.BaseURL.web.replace(/\/$/, "")}/team/join-cart/${id})`}
                                    title={`Hey, join the team "${teamInfo.detail.team_name}" and get a discount of ${Utils.convertToPriceFormat(teamInfo.detail.member_off_price)} on the purchase`}
                                >
                                    <TwitterIcon size={40} round />
                                </TwitterShareButton>
                                &nbsp;
                                <LinkedinShareButton url={`${Config.BaseURL.web.replace(/\/$/, "")}/team/join-cart/${id}`}>
                                    <LinkedinIcon size={40} round />
                                </LinkedinShareButton>
                                <RWebShare
                                    data={{
                                        text: `Hey, join the team "${teamInfo.detail.team_name}" and get a discount of ${Utils.convertToPriceFormat(teamInfo.detail.member_off_price)} on the purchase`,
                                        url: `${Config.BaseURL.web.replace(/\/$/, "")}/team/join-cart/${id}`,
                                        title: `Hey, join the team "${teamInfo.detail.team_name}" and get a discount of ${Utils.convertToPriceFormat(teamInfo.detail.member_off_price)} on the purchase`
                                    }}
                                    onClick={() => console.log("shared successfully!")}
                                >
                                    <a style={{ padding: '0px', cursor: 'pointer', zIndex: 1 }} className="mt-10"> <Image
                                        width={40}
                                        alt={"add button"}
                                        layout="raw"
                                        height={40}
                                        src={"/img/link-share.svg"} /></a>
                                </RWebShare>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
