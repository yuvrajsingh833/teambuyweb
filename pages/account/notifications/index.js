import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';

import * as NotificationService from "../../../services/notification";

import * as Dates from "../../../lib/dateFormatService";

import AccountSideBar from "../../../component/accountSidebar";
import LoaderInline from '../../../component/loaderInline';
import NoDataFound from "../../../component/nodataFound";
import { Config } from '../../../config/config';
import * as Utils from "../../../lib/utils";

export default function MyNotifications(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [allNotifications, setAllNotifications] = useState([]);
    const [currentPageNo, setCurrentPageNo] = useState(1)
    const [notificationInfo, setNotificationInfo] = useState({})

    const getAllNotifications = (page = currentPageNo, loading = true) => {
        setIsLoading(loading)
        NotificationService.allNotification({ limit: Config.PageSize, page: page }).then(response => {
            let dataItems = response.data.items

            if (page == 1) {
                setCurrentPageNo(1);
                setAllNotifications(dataItems)
            } else {
                setAllNotifications(newDataList => ([...newDataList, ...dataItems]))
            }

            setNotificationInfo(response.data.paginator)

            setIsLoading(false)
            setIsLoadingMore(false)
        }).catch(e => {
            setIsLoading(false)
            setIsLoadingMore(false)
            console.log(`allNotification error : ${e}`)
        })
    }

    const getMoreNotifications = () => {
        if (notificationInfo.hasNextPage) {
            let newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo)
            getAllNotifications(newPageNo, false)
            setIsLoadingMore(true)
        } else {
            setIsLoadingMore(false)
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight || isLoadingMore) return;
        setIsLoadingMore(true)
    };

    useEffect(() => {
        setIsLoading(true)
        getAllNotifications();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [props])

    useEffect(() => {
        if (!isLoadingMore) return;
        getMoreNotifications();
    }, [isLoadingMore]);

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>My Notifications | Teambuy</title>
                <meta name="description" content="My Notifications | Teambuy" />
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
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("My Notifications")}</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="common-wrap ptb-40">
                <div className="container">
                    <div className="common-flex d-flex">
                        <div className="common-left">
                            <a style={{ cursor: 'pointer' }} onClick={() => window.openUserSideBar()} className="mob-profile-menu"></a>
                            <div className="lm-overflow-bg" onClick={() => window.closeUserSideBar()}></div>
                            <div className="left-menu-box">
                                <AccountSideBar />
                            </div>
                        </div>

                        <div className="common-right">
                            <div className="white-box notifaction-block">
                                {allNotifications.length < 1 &&
                                    <NoDataFound
                                        image="/bgicon/user.png"
                                        title="No new notification"
                                        subtitle="No update for you at the moment."
                                    />}
                                {allNotifications.map(item => {
                                    return <div key={`all_notifications_${item.id}`} className="white-box pd-15 d-flex align-items-center mb-20">
                                        <div>
                                            <div className="xs-heading fw-500">{Utils.getLanguageLabel(item.title)}</div><br />
                                            <div className="xs-heading font-12">{item.content}</div>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="xs-heading font-12 gray-text faq-date">{Dates.localDate(item.created_at)}</div>
                                        </div>
                                    </div>
                                })}
                            </div>
                            {isLoadingMore && <div className="white-box pd-15 d-flex align-items-center mb-20"> <LoaderInline /></div>}
                        </div>
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )
}