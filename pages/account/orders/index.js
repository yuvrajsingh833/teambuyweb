import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';

import * as UserService from "../../../services/user";

import * as Dates from "../../../lib/dateFormatService";
import * as Utils from "../../../lib/utils";

import AccountSideBar from "../../../component/accountSidebar";
import LoaderInline from '../../../component/loaderInline';
import NoDataFound from "../../../component/nodataFound";
import { Config } from '../../../config/appConfig';

const OrderInformation = ({ orderInfo }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const [isPlaced, setIsPlaced] = useState(false);
    const [isPlacedDate, setIsPlacedDate] = useState(null);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isAcceptedDate, setIsAcceptedDate] = useState(null);
    const [isOutForDelivery, setIsOutForDelivery] = useState(false);
    const [isOutForDeliveryDate, setIsOutForDeliveryDate] = useState(null);
    const [isDelivered, setIsDelivered] = useState(false);
    const [isDeliveredDate, setIsDeliveredDate] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isCancelledDate, setIsCancelledDate] = useState(null);

    useEffect(() => {
        orderInfo?.orderDeliveryStatus.map(deliveryItem => {
            if (deliveryItem.status == "pending") {
                setIsPlaced(true)
                setIsPlacedDate(deliveryItem.created_at)
            } if (deliveryItem.status == "accepted") {
                setIsAccepted(true)
                setIsAcceptedDate(deliveryItem.created_at)
            } if (deliveryItem.status == "outfordelivery") {
                setIsOutForDelivery(true)
                setIsOutForDeliveryDate(deliveryItem.created_at)
            } if (deliveryItem.status == "delivered") {
                setIsDelivered(true)
                setIsDeliveredDate(deliveryItem.created_at)
            } if (deliveryItem.status == "cancelled") {
                setIsCancelled(true)
                setIsCancelledDate(deliveryItem.created_at)
            }
        })
    }, [])

    return <div className="order-product-info">
        <div className="row">
            <div className="col-4 align-self-center">
                <div className="xs-heading fw-500">{Utils.getLanguageLabel("Order")} #{orderInfo.order_txn_id}</div>
                <div className="xs-heading font-12">{Utils.getLanguageLabel("Placed on")} <span className="fw-500">{Dates.localDate(orderInfo.created_at)}</span></div>
                <div className="xs-heading font-12">{Utils.getLanguageLabel("Items")}: <span className="fw-500">{orderInfo.orderItems.length}</span>&nbsp;&nbsp;&nbsp; {Utils.getLanguageLabel("Total")}: <span className="fw-500">{Utils.convertToPriceFormat(orderInfo.total_price)}</span></div>
            </div>
            <div className="col-4 align-self-center">
                {isExpanded ?
                    isCancelled == true ?
                        <ul className="op-delivery-process">
                            <li className={isPlaced ? "" : "pending"}>
                                <div className="d-flex align-items-center">
                                    <div>{Utils.getLanguageLabel("Order placed")}</div>
                                    <div className="ml-auto font-12">{isPlaced ? Dates.localDate(isPlacedDate) : Utils.getLanguageLabel("Pending")}</div>
                                </div>
                            </li>
                            <li className={isCancelled ? "" : "pending"}>
                                <div className="d-flex align-items-center">
                                    <div>{Utils.getLanguageLabel("Order Cancelled")}</div>
                                    <div className="ml-auto font-12">{isCancelled ? Dates.localDate(isCancelledDate) : Utils.getLanguageLabel("Pending")}</div>
                                </div>
                            </li>
                        </ul> :
                        <ul className="op-delivery-process">
                            <li className={isPlaced ? "" : "pending"}>
                                <div className="d-flex align-items-center">
                                    <div>{Utils.getLanguageLabel("Order placed")}</div>
                                    <div className="ml-auto font-12">{isPlaced ? Dates.localDate(isPlacedDate) : Utils.getLanguageLabel("Pending")}</div>
                                </div>
                            </li>
                            <li className={isAccepted ? "" : "pending"}>
                                <div className="d-flex align-items-center">
                                    <div>{Utils.getLanguageLabel("Order confirmed")}</div>
                                    <div className="ml-auto font-12">{isAccepted ? Dates.localDate(isAcceptedDate) : Utils.getLanguageLabel("Pending")}</div>
                                </div>
                            </li>
                            <li className={isOutForDelivery ? "" : "pending"}>
                                <div className="d-flex align-items-center">
                                    <div>{Utils.getLanguageLabel("Out for delivery")}</div>
                                    <div className="ml-auto font-12">{isOutForDelivery ? Dates.localDate(isOutForDeliveryDate) : Utils.getLanguageLabel("Pending")}</div>
                                </div>
                            </li>
                            <li className={isDelivered ? "" : "pending"}>
                                <div className="d-flex align-items-center">
                                    <div>{Utils.getLanguageLabel("Order delivered")}</div>
                                    <div className="ml-auto font-12">{isDelivered ? Dates.localDate(isDeliveredDate) : Utils.getLanguageLabel("Pending")}</div>
                                </div>
                            </li>
                        </ul> : null
                }
            </div>
            <div className="col-4 text-center align-self-center">
                <Link
                    passHref
                    href={{
                        pathname: '/account/orders/order-detail/[orderId]/[orderTnxId]',
                        query: { orderId: orderInfo.id, orderTnxId: orderInfo.order_txn_id },
                    }}
                >
                    <a>
                        <button className="green-btn">{isDelivered ? Utils.getLanguageLabel("VIEW ORDER") : Utils.getLanguageLabel("TRACK ORDER")}</button>
                    </a>
                </Link>
                <a style={isExpanded ? { cursor: 'pointer', transform: `rotate(180deg)` } : { cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)} className="order-down-arrow"></a>
            </div>
        </div>
    </div>
}

export default function MyOrders(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [allOrders, setAllOrders] = useState([]);
    const [currentPageNo, setCurrentPageNo] = useState(1)
    const [orderInfo, setOrderInfo] = useState({})

    const getAllOrders = (page = currentPageNo, loading = true) => {
        setIsLoading(loading)
        UserService.getAllOrders({ limit: Config.PageSize, page: page }).then(response => {
            let dataItems = response.data.items

            if (page == 1) {
                setCurrentPageNo(1);
                setAllOrders(dataItems)
            } else {
                setAllOrders(newDataList => ([...newDataList, ...dataItems]))
            }

            setOrderInfo(response.data.paginator)

            setIsLoading(false)
            setIsLoadingMore(false)
        }).catch(e => {
            setIsLoading(false)
            setIsLoadingMore(false)
            console.log(`getAllOrders error : ${e}`)
        })
    }

    const getMoreOrders = () => {
        if (orderInfo.hasNextPage) {
            let newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo)
            getAllOrders(newPageNo, false)
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
        getAllOrders();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [props])

    useEffect(() => {
        if (!isLoadingMore) return;
        getMoreOrders();
    }, [isLoadingMore]);

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>My Orders | Teambuy</title>
                <meta name="description" content="My Orders | Teambuy" />
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
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("My Orders")}</li>
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
                            <div className="white-box all-orders-block">
                                <div className="block-scroll-x">
                                    <div className="block-scroll-x-width">
                                        {allOrders.length < 1 &&
                                            <NoDataFound
                                                image="/bgicon/order.png"
                                                title="No order"
                                                subtitle="Place a new order."
                                            />}
                                        {allOrders.map(item => {
                                            return <div key={`all_orders_${item.id}`} className="white-box d-flex pd-20 mb-20">
                                                <div className="order-product-icon mt-10">
                                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={45} width={45} alt="product" src="/img/product-icon.png" />
                                                </div>

                                                <OrderInformation orderInfo={item} />
                                            </div>
                                        })}
                                    </div>
                                    {isLoadingMore && <div className="white-box d-flex pd-20 mb-20"> <LoaderInline /></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )
}