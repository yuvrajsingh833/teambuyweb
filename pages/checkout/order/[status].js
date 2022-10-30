import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import bodyParser from "body-parser"
import util from "util"
const getBody = util.promisify(bodyParser.urlencoded());

import Loader from '../../../component/loader'

import * as Utils from "../../../lib/utils"
import * as PaymentService from "../../../services/payment"
import * as UserService from "../../../services/user"

export default function CheckoutOrderStatusDetail(props) {
    const router = useRouter();
    const { status, txnid, mode, additionalPaymentData } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [paymentVerificationInfo, setVerificationInfo] = useState({})
    const [orderInformation, setOrderInformation] = useState(null)

    const fetchOrderInfo = () => {
        UserService.getOrderDetail({ orderTXNID: txnid }).then(response => {
            setOrderInformation(response.data)
        }).catch(e => {
            console.log(`updatePayment error : ${e}`)
            setOrderInformation({})
        })
    }

    useEffect(() => {
        fetchOrderInfo()

        if (mode == "cod") {
            setVerificationInfo(JSON.parse(additionalPaymentData))
            PaymentService.updatePayment({
                paymentResponse: {
                    result: JSON.parse(additionalPaymentData)
                }
            }).then(response => {
                if (status == 'success') {
                    document.getElementById("cartCountImage").src = "/img/cart-icon.svg";
                    document.getElementById("cartCountImage").srcset = "/img/cart-icon.svg 1x, /img/cart-icon.svg 2x";
                    document.getElementById("cartCount").innerHTML = `0`;
                }
                setIsLoading(false)
                Utils.deleteStateAsyncStorage("selectedDeliveryAddress")
                Utils.deleteStateAsyncStorage("appliedCoupon")
                Utils.deleteStateAsyncStorage("teamBuyCart")
            }).catch(e => {
                console.log(`updatePayment error : ${e}`)
                setIsLoading(false)
            })
        } else if (mode == "online") {
            PaymentService.verifyPayment({ txnID: txnid }).then(response => {
                let data = response.data.transaction_details[txnid]
                data['paymentMode'] = 'online'
                setVerificationInfo(data)
                PaymentService.updatePayment({
                    paymentResponse: {
                        result
                            : data
                    }
                }).then(response => {
                    if (status == 'success') {
                        document.getElementById("cartCountImage").src = "/img/cart-icon.svg";
                        document.getElementById("cartCountImage").srcset = "/img/cart-icon.svg 1x, /img/cart-icon.svg 2x";
                        document.getElementById("cartCount").innerHTML = `0`;
                    }
                    setIsLoading(false)
                    Utils.deleteStateAsyncStorage("selectedDeliveryAddress")
                    Utils.deleteStateAsyncStorage("appliedCoupon")
                    Utils.deleteStateAsyncStorage("teamBuyCart")
                }).catch(e => {
                    console.log(`updatePayment error : ${e}`)
                    setIsLoading(false)
                })
            }).catch((err) => {
                console.log("err", err)
            })
        }
    }, [props])

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Order {status} | Teambuy</title>
                <meta name="description" content={`Order ${status} | Teambuy`} />
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
                                <Link passHref href={{ pathname: "/checkout" }}>
                                    <a>{Utils.getLanguageLabel("Checkout")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Order " + status)}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="cart-wrap ptb-40">
                <div className="container">
                    {status == 'failure' ? <div className="text-center cart-success-block">
                        <div className="success-icon">
                            <Image layout='raw' height={120} width={120} quality={100} alt='status-icon' src="/bgicon/fail.png" />
                        </div>
                        <div className="sm-heading mt-40 text-center">{Utils.getLanguageLabel("Oops! Order failed")}</div>
                        <div className="xs-heading mt-20">{paymentVerificationInfo.error_Message}</div>
                        <div className="mt-40 text-center">
                            <Link passHref href={{ pathname: '/checkout/summary' }}>
                                <a className="green-btn mnw-248">{Utils.getLanguageLabel("BACK TO CHECKOUT")}</a>
                            </Link>
                        </div>
                    </div> : <div className="text-center cart-success-block">
                        <div className="success-icon">
                            <Image layout='raw' height={120} width={120} quality={100} alt='status-icon' src="/bgicon/success.png" />
                        </div>
                        <div className="sm-heading mt-40 text-center">{Utils.getLanguageLabel("Your order was placed")} <br />{Utils.getLanguageLabel("successfully!!")}</div>
                        <div className="xs-heading mt-20">{Utils.getLanguageLabel("Order")} #{txnid}</div>
                        <div className="xs-heading mt-10">{Utils.getLanguageLabel("Placed on")}  {paymentVerificationInfo.addedon.split(" ")[0]}</div>
                        <div className="xs-heading mt-6"><span>{Utils.getLanguageLabel("Total")}: {Utils.convertToPriceFormat(paymentVerificationInfo.amt)}</span></div>
                        <div className="xs-heading mt-30 text-uppercase">{Utils.getLanguageLabel("you will get confirmation in a while")}</div>
                        <div className="mt-40 text-center">
                            <Link passHref href={{ pathname: '/account/orders' }}>
                                <a className="green-btn mnw-248"><span className="cube-scan"></span>{Utils.getLanguageLabel("TRACK ORDER")}</a>
                            </Link>
                        </div>
                    </div>}
                </div>
            </section>
        </>
    )
}

export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        await getBody(req, res);
    }

    return {
        props: {
            method: req.method,
            body: req.method == 'POST' ? req.body : null,
        }
    }
}