import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'


import Feature from '../../../../../component/feature';
import Loader from '../../../../../component/loader';

import * as UserService from "../../../../../services/user";

import * as Dates from "../../../../../lib/dateFormatService";
import * as Utils from "../../../../../lib/utils";

import AccountSideBar from "../../../../../component/accountSidebar";
import { Config } from '../../../../../config/appConfig';
import LoaderInline from '../../../../../component/loaderInline';

const OrderInformation = ({ orderInfo }) => {

    const [isPlaced, setIsPlaced] = useState(false);
    const [isPlacedDate, setIsPlacedDate] = useState(null);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isAcceptedDate, setIsAcceptedDate] = useState(null);
    const [isOutForDelivery, setIsOutForDelivery] = useState(false);
    const [isOutForDeliveryDate, setIsOutForDeliveryDate] = useState(null);
    const [isDelivered, setIsDelivered] = useState(false);
    const [isDeliveredDate, setIsDeliveredDate] = useState(null);

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
            }
        })
    }, [])

    return <div className="order-product-info">
        <div className="row">
            <div className="col-3 align-self-center">
                <div className="xs-heading fw-500">Order #{orderInfo.order_txn_id}</div>
                <div className="xs-heading font-12">Placed on <span className="fw-500">{Dates.localDate(orderInfo.created_at)}</span></div>
                <div className="xs-heading font-12">Items: <span className="fw-500">{orderInfo.orderItems.length}</span>&nbsp;&nbsp;&nbsp; Total: <span className="fw-500">₹{orderInfo.total_price}</span></div>
            </div>
            <div className="col-5 align-self-center">
                <div className="row">
                    <div className="col-md-10">
                        <div className="sm-heading list-disc">Delivery address</div>
                        <div className="mt-10 pl-15">
                            <div className="xs-heading">{orderInfo?.orderDeliveryAddress[0]?.full_name}
                                {/* <span className="fw-300">(Home address)</span> */}
                            </div>
                            <div className="xs-content mt-1">{orderInfo?.orderDeliveryAddress[0]?.apt}, {orderInfo?.orderDeliveryAddress[0]?.formatted_address} ,{orderInfo?.orderDeliveryAddress[0]?.pincode}</div>
                            <div className="xs-content mt-1">+91 {orderInfo?.orderDeliveryAddress[0]?.mobile_number}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-4 text-center align-self-center">
                <ul className="op-delivery-process">
                    <li className={isPlaced ? "" : "pending"}>
                        <div className="d-flex align-items-center">
                            <div>Order placed</div>
                            <div className="ml-auto font-12">{isPlaced ? Dates.localDate(isPlacedDate) : "Pending"}</div>
                        </div>
                    </li>
                    <li className={isAccepted ? "" : "pending"}>
                        <div className="d-flex align-items-center">
                            <div>Order confirmed</div>
                            <div className="ml-auto font-12">{isAccepted ? Dates.localDate(isAcceptedDate) : "Pending"}</div>
                        </div>
                    </li>
                    <li className={isOutForDelivery ? "" : "pending"}>
                        <div className="d-flex align-items-center">
                            <div>Out for delivery</div>
                            <div className="ml-auto font-12">{isOutForDelivery ? Dates.localDate(isOutForDeliveryDate) : "Pending"}</div>
                        </div>
                    </li>
                    <li className={isDelivered ? "" : "pending"}>
                        <div className="d-flex align-items-center">
                            <div>Order delivered</div>
                            <div className="ml-auto font-12">{isDelivered ? Dates.localDate(isDeliveredDate) : "Pending"}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}

export default function OrderDetail(props) {
    const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.productBanner}`
    const router = useRouter();
    const { orderId, orderTxnId } = router.query;

    const [isLoading, setIsLoading] = useState(true);

    const [orderInfo, setOrderInfo] = useState({})

    const getAllOrders = () => {
        setIsLoading(true)
        if (orderId)
            UserService.getOrderDetail({ orderID: orderId }).then(response => {
                setOrderInfo(response.data)
                setIsLoading(false)
            }).catch(e => {
                setIsLoading(false)
                console.log(`.getOrderDetail error : ${e}`)
            })
    }

    useEffect(() => {
        setIsLoading(true)
        getAllOrders();
    }, [props])

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Orders #{orderTxnId} | Teambuy</title>
                <meta name="description" content={`Orders #${orderTxnId}| Teambuy`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/" }}>
                                    <a>Home</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a >My account</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account/orders" }}>
                                    <a >My Orders</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{orderTxnId}</li>
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
                                        <div className="white-box d-flex pd-20 mb-20">
                                            <div className="order-product-icon mt-10">
                                                <img src="/img/product-icon.png" />
                                            </div>
                                            <OrderInformation orderInfo={orderInfo} />
                                        </div>
                                    </div>
                                </div>


                                <div className="row mt-20 od-block">
                                    <div className="col-md-5">
                                        <div className="xs-heading list-disc fw-500">Order items</div>

                                        {orderInfo?.orderItems.map((orderItemInfo, index) => {
                                            let productDetail = JSON.parse(orderItemInfo?.full_product_info)
                                            return <div key={`bill_order_items_${productDetail._id}_${index}`} className="white-box pd-0 mt-10">
                                                <div className="cart-main-box pd-15">
                                                    <div className="d-flex to-product-flex align-items-center">
                                                        <div className="to-product-count font-15 fw-500">{index + 1}.</div>
                                                        <div className="product-img mb-0">
                                                            <Image
                                                                src={Utils.generateProductImage(productDetail)}
                                                                alt={productDetail?.name}
                                                                layout="raw"
                                                                height={200}
                                                                width={200}
                                                                className={'common-product-image'}
                                                                style={{ objectFit: 'contain' }}
                                                            />
                                                        </div>
                                                        <div className="product-content">
                                                            <div className="d-flex align-items-center">
                                                                <div>
                                                                    <div className="xs-heading fw-500 font-12">{productDetail.name} x{orderItemInfo.quantity}</div>
                                                                    <div className="weight-count">{productDetail.size}</div>
                                                                    <div className="product-price">₹{Number(orderItemInfo.total_amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}

                                    </div>

                                    <div className="col-md-4 offset-md-3">
                                        <div className="xs-heading list-disc fw-500">Bill Details</div>
                                        <div className="cart-table">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <td>Sub total</td>
                                                        <td className="text-right">₹{Number(orderInfo.total_price + orderInfo.coupon_discount + orderInfo.wallet_amount - orderInfo.delivery_charges).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Team buy discount</td>
                                                        <td className="green-text text-right">-₹{Number(orderInfo.teambuy_discount).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Coupon discount</td>
                                                        <td className="green-text text-right">-₹{Number(orderInfo.coupon_discount).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Wallet discount</td>
                                                        <td className="green-text text-right">-₹{Number(orderInfo.wallet_amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Delivery Charge</td>
                                                        <td className="red-text text-right">+₹{Number(orderInfo.delivery_charges).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-500">Total payable amount</td>
                                                        <td className="fw-500 text-right">₹{Number(orderInfo.total_price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
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