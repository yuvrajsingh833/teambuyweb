import Head from 'next/head';
import Image from 'next/image';
import dynamic from "next/dynamic";
import Link from 'next/link';
import React, { useEffect, useState } from "react";

import { Config } from '../../config/config';

import * as Utils from '../../lib/utils';
import * as CategoryService from "../../services/category";
import * as TeamService from "../../services/team";
import Feature from '../../component/feature';

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function Category(props) {
    const BASE_URL = `${Config.BaseURL.fileServer}${Config.FilePath.teamAvatar}`

    const [isLoading, setIsLoading] = useState(true);

    const [nearbyTeams, setNearbyTeams] = useState([]);
    const [myTeams, setMyTeams] = useState([]);

    const getNearbyTeam = () => {
        TeamService.getNearbyTeams({ teamPincode: null }).then(nearByTeamResponse => {
            setNearbyTeams(nearByTeamResponse.data)
            TeamService.getMyTeams({ teamPincode: null }).then(response => {
                setMyTeams(response.data)
                setIsLoading(false)
            }).catch(e => {
                console.log(`getNearbyTeams error : ${e}`)
                setIsLoading(false)
            })
        }).catch(e => {
            console.log(`getNearbyTeams error : ${e}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getNearbyTeam()
    }, [props])


    return (
        <>
            <Head>
                <title>Teams around you | Teambuy</title>
            </Head>
            <section className="category-wrap teams-banner">
                <div className="container d-flex align-items-center justify-content-start">
                    <div className=" heading-flex ptb-40">
                        <div className="team-heading">{Utils.getLanguageLabel("Shop ")}<span style={{ color: '#FB6A09' }}>{Utils.getLanguageLabel("Together")}</span></div>
                        <div className="team-heading">{Utils.getLanguageLabel("Save ")}<span style={{ color: '#FB6A09' }}>{Utils.getLanguageLabel("Together")}</span></div>
                    </div>
                </div>
            </section>

            <section className="category-wrap">
                <div className="container">
                    <div className="align-items-center heading-flex ptb-10">
                        <div className="sm-heading">{Utils.getLanguageLabel("Select existing nearby team")}</div>
                        <div className="text-start xs-heading text-ellipsis fw-500">{Utils.getLanguageLabel("Join a team and got a discount on your purchase")}</div>
                    </div>
                    <div className="row category-list">
                        {nearbyTeams.map(team => {
                            return <Link key={`team_member_${team.id}`} passHref href={{
                                pathname: "/team/join-cart/[id]",
                                query: { id: team.team_code }
                            }} >

                                <a className="col-sm-4 col-6 item d-flex align-items-center nearby-box mb-20">
                                    <div className="circle-box team-circle">
                                        <Image alt={team.team_name} src={BASE_URL + team.team_avatar} layout="raw" height={100} width={100} />
                                    </div>
                                    <div className="xs-heading text-ellipsis">{team.team_name}</div>
                                </a>
                            </Link>
                        })}
                    </div>
                </div>
            </section>

            {myTeams && myTeams.length > 0 && <section className="category-wrap ptb-10">
                <div className="container">
                    <div className="align-items-center heading-flex ptb-40">
                        <div className="sm-heading">{Utils.getLanguageLabel("My teams")}</div>
                        <div className="text-start xs-heading text-ellipsis fw-500">{Utils.getLanguageLabel("Your existing teams")}</div>
                    </div>
                    <div className="row category-list">
                        {myTeams.map(team => {
                            return <Link key={`team_member_${team.id}`} passHref href={{
                                pathname: "/team/join-cart/[id]",
                                query: { id: team.team_code }
                            }} >

                                <a className="col-sm-4 col-6 item d-flex align-items-center nearby-box mb-20">
                                    <div className="circle-box team-circle">
                                        <Image alt={team.team_name} src={BASE_URL + team.team_avatar} layout="raw" height={100} width={100} />
                                    </div>
                                    <div className="xs-heading text-ellipsis">{team.team_name}</div>
                                </a>
                            </Link>
                        })}
                    </div>
                </div>
            </section>}
            <Feature />
        </>
    )
}