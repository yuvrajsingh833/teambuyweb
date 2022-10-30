import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import router from "next/router";

import { Config } from '../../../config/config';
import * as Utils from "../../../lib/utils";
import Base64 from "../../../lib/base64";
import * as Dates from "../../../lib/dateFormatService";

import Loader from '../../../component/loader';
import AuthSideBar from "../../../component/authSidebar";
import Feature from "../../../component/feature";

import * as CheckoutService from "../../../services/checkout";
import * as MasterService from "../../../services/master";
import * as PaymentService from "../../../services/payment";
import * as UserService from "../../../services/user";

export default function CheckoutSummaryPage(props) {
    const couponApplied = Utils.getStateAsyncStorage("appliedCoupon")
    const selectedDeliveryAddress = Utils.getStateAsyncStorage("selectedDeliveryAddress")
    const teamBuyCartInfo = Utils.getStateAsyncStorage("teamBuyCart")

    const appliedCoupon = (couponApplied && Object.keys(couponApplied).length > 0) ? couponApplied : null;
    const selectedAddress = (selectedDeliveryAddress && Object.keys(selectedDeliveryAddress).length > 0) ? selectedDeliveryAddress : null;

    const userData = useSelector(state => state.userData)
    global.user = userData?.userData

    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    const [paymentMode, setPaymentMode] = useState('online')

    const [cartItems, setCartItems] = useState([]);

    const [GSTAmount, setGSTAmount] = useState(0);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [couponDiscount, setCouponDiscount] = useState(0);

    const [hasOutOfStockProduct, setHasOutOfStockProduct] = useState(false);

    const [teambuyOfferPrice, setTeambuyOfferPrice] = useState(0);
    const [teambuyOffer, setTeambuyOffer] = useState((teamBuyCartInfo && Object.keys(teamBuyCartInfo).length > 0) ? teamBuyCartInfo : null);

    const [walletInfo, setWalletInfo] = useState({});

    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [minCartForFreeDelivery, setMinCartForFreeDelivery] = useState(0);
    const [maxUsableWalletAmount, setMaxUsableWalletAmount] = useState(0);
    const [maxUsableWalletPercent, setMaxUsableWalletPercent] = useState(0);

    const getAllCartItems = () => {
        setIsLoading(true)
        CheckoutService.getCart().then(response => {

            try {
                if (response.data.length > 0) {
                    document.getElementById("cartCountImage").src = "/img/cart-active-icon.svg";
                    document.getElementById("cartCountImage").srcset = "/img/cart-active-icon.svg 1x, /img/cart-active-icon.svg 2x";
                    document.getElementById("cartCount").innerHTML = `${response.data.length}`;
                } else {
                    document.getElementById("cartCountImage").src = "/img/cart-icon.svg";
                    document.getElementById("cartCountImage").srcset = "/img/cart-icon.svg 1x, /img/cart-icon.svg 2x";
                    document.getElementById("cartCount").innerHTML = `0`;
                }
            } catch (error) { console.log("navIssue") }

            let gst = 0;
            let subTotal = 0;
            let teambuyOfferDiscount = 0;

            response.data.map(mapItems => {
                if (!(mapItems.product_info.stock >= mapItems.product_info.reserve_stock && mapItems.product_info.stock != 0)) {
                    setHasOutOfStockProduct(true)
                }
                gst = gst + (mapItems.product_info.gst_amount * mapItems.quantity)
                subTotal = subTotal + (mapItems.product_info.price_without_gst * mapItems.quantity)
                teambuyOfferDiscount = teambuyOfferDiscount + (mapItems.product_info.teambuy_offer_price * mapItems.quantity)
            })

            setSubTotalAmount(subTotal)
            setTeambuyOfferPrice(teambuyOfferDiscount)
            setGSTAmount(gst)
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
        setGSTAmount(0);
        setSubTotalAmount(0);
        setCouponDiscount(0);
        setWalletInfo({});
        setDeliveryCharge(0);
        setMinCartForFreeDelivery(0);
        setMaxUsableWalletAmount(0);
        setMaxUsableWalletPercent(0);

        PaymentService.allWalletTransactions({ limit: Config.PageSize, page: 1 }).then(response => {
            setWalletInfo(response.data.information)
            MasterService.settings().then(settingResponse => {
                (settingResponse.data).map(settingItem => {
                    if (settingItem.key == "delivery_charge") {
                        setDeliveryCharge(settingItem.value)
                    }
                    if (settingItem.key == "free_delivery_min_cart") {
                        setMinCartForFreeDelivery(settingItem.value)
                    }
                    if (settingItem.key == "max_wallet_amount") {
                        setMaxUsableWalletAmount(settingItem.value)
                    }
                    if (settingItem.key == "cart_wallet_applicable_percent") {
                        setMaxUsableWalletPercent(settingItem.value)
                    }
                })

            }).catch(e => { console.log(`settings error : ${e}`) })
        }).catch(e => { console.log(`allWalletTransactions error : ${e}`) })

        getAllCartItems()
    }, [props])

    const calculatePrice = () => {

        /** Price before discount calculated */
        let subTotal = subTotalAmount

        /** GST Charge calculation */
        let appliedGSTAmount = GSTAmount

        /** Wallet discount calculation */

        let appliedWalletAmount = walletInfo?.amount || 0

        if (walletInfo && walletInfo?.amount > 0) {
            let walletDiscountPercentAmount = (maxUsableWalletPercent / 100) * subTotal;
            if (Number(walletDiscountPercentAmount) >= Number(maxUsableWalletAmount)) {
                appliedWalletAmount = maxUsableWalletAmount
                if (walletInfo.amount < appliedWalletAmount) {
                    appliedWalletAmount = walletInfo.amount
                }
            } else {
                appliedWalletAmount = walletDiscountPercentAmount.toFixed(2)
                if (walletInfo.amount < appliedWalletAmount) {
                    appliedWalletAmount = walletInfo.amount
                }
            }
        }

        /** Coupon discount calculation */
        let appliedDiscountAmount = couponDiscount;

        let totalAmount = subTotal + appliedGSTAmount;

        // let discountAmount = 0
        if (appliedCoupon) {
            if (appliedCoupon.type == 'percent') {
                appliedDiscountAmount = totalAmount * (appliedCoupon.discount / 100)
                if (appliedDiscountAmount > appliedCoupon.max_discount_amount && appliedCoupon.max_discount_amount != 0) {
                    appliedDiscountAmount = appliedCoupon.max_discount_amount
                }
            } else {
                appliedDiscountAmount = appliedCoupon.discount
            }
        }

        /**Calculate teambuy discount */
        let appliedTeambuyDiscount = 0;
        if (teambuyOffer) {
            appliedTeambuyDiscount = teambuyOffer.discount
        }

        /** Delivery charge calculation */
        let appliedDeliveryCharges = deliveryCharge
        if (Number(subTotal) >= Number(minCartForFreeDelivery)) {
            appliedDeliveryCharges = 0
        }

        /** Total payable price calculation */
        let totalPrice = (Number(subTotal) + Number(appliedDeliveryCharges) + Number(appliedGSTAmount)) - (Number(appliedDiscountAmount) + Number(appliedWalletAmount) + Number(appliedTeambuyDiscount))

        return {
            SUB_TOTAL: subTotal,

            APPLICABLE_WALLET_DISCOUNT: appliedWalletAmount,
            APPLICABLE_COUPON_DISCOUNT: appliedDiscountAmount,

            APPLICABLE_DELIVERY_CHARGE: appliedDeliveryCharges,
            APPLIED_GST: appliedGSTAmount,

            APPLIED_TEAM_BUY_DISCOUNT: appliedTeambuyDiscount,

            TOTAL: totalPrice
        }
    }

    const renderPriceAmount = (cartItem, purchaseQuantity) => {
        let discountPrice = 0;
        let sellingPrice = 0;
        if (cartItem.discount.length > 0) {
            sellingPrice = purchaseQuantity * (cartItem.gst_amount + cartItem.price_without_gst)
        } else {
            sellingPrice = purchaseQuantity * (cartItem.gst_amount + cartItem.business_price_without_gst)
        }
        return { sellingPrice, discountPrice }
    }

    const placeOrder = async () => {
        let TXN_ID = `TB_REG_${global.user.id}_${Dates.getUTCTimestamp(new Date())}`;

        let orderInformation = [];
        await Promise.all(cartItems.map(mapItem => {
            let info = {
                "productID": mapItem.product_id,
                "productName": mapItem.product_info.name,
                "productPrice": renderPriceAmount(mapItem.product_info, mapItem.quantity).sellingPrice,
                "productDiscount": renderPriceAmount(mapItem.product_info, mapItem.quantity).discountPrice,
                "productQuantity": mapItem.quantity,
                "productInfo": mapItem.product_info
            }

            orderInformation.push(info)
        }))

        let postParams = {
            "orderItems": orderInformation,
            "orderTXNID": TXN_ID,
            "orderAmount": (Number(calculatePrice().TOTAL).toFixed(2)),
            "couponID": appliedCoupon ? appliedCoupon.id : 0,
            "couponDiscount": calculatePrice().APPLICABLE_COUPON_DISCOUNT,
            "teambuyDiscount": calculatePrice().APPLIED_TEAM_BUY_DISCOUNT,
            "deliveryCharges": calculatePrice().APPLICABLE_DELIVERY_CHARGE,
            "walletAmount": calculatePrice().APPLICABLE_WALLET_DISCOUNT,
            "addressID": selectedAddress.id,
            "paymentMode": paymentMode,
            "teamID": teambuyOffer ? teambuyOffer.teamID : 0,
            "orderType": teambuyOffer ? 'team' : 'individual',
            "preferredOrderDate": 0,
            "preferredOrderTime": 0,
        }

        setIsLoading(true)
        PaymentService.createPayment(postParams).then(response => {
            setIsLoading(false)
            let postParams = {
                "amount": (Number(calculatePrice().TOTAL).toFixed(2)),
                "email": selectedAddress?.email,
                "firstName": selectedAddress?.full_name,
                "phone": selectedAddress?.mobile_number,
                "productInfo": `${global.user.mobileNumber}(${global.user.id}) order from teambuy`,
                "txnID": TXN_ID,
                "udf5": ""
            };

            if (paymentMode == "online") {
                PaymentService.paymentGateway(postParams).then(response => {
                    let postData = response.data

                    postParams['furl'] = postData.furl
                    postParams['hash'] = postData.hash
                    postParams['key'] = postData.key
                    postParams['salt'] = postData.salt
                    postParams['surl'] = postData.surl
                    postParams['purl'] = postData.purl

                    router.push({
                        pathname: '/checkout/payment',
                        query: { pd: Base64.btoa(JSON.stringify(postParams)) }
                    })
                }).catch(e => {
                    console.log(`paymentGateway error : ${e}`)
                })
            } else {

                postParams['txnid'] = postParams.txnID;
                postParams['txnId'] = postParams.txnID;
                postParams['status'] = 'pending';
                postParams['error_message'] = 'NO ERROR';
                postParams['paymentMode'] = paymentMode;
                postParams['hasError'] = false;
                postParams['transaction_amount'] = postParams.amount.toString();
                postParams['amt'] = postParams.amount.toString();
                postParams['addedon'] = Dates.momentDateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
                router.push({
                    pathname: '/checkout/order/[status]',
                    query: {
                        status: 'success',
                        mode: 'cod',
                        txnid: TXN_ID,
                        additionalPaymentData: JSON.stringify(postParams)
                    }
                })
            }
        }).catch(e => {
            console.log(`createPaymentInformation error : ${e}`)
            setIsLoading(false)
        })
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
                <title>Cart | Teambuy</title>
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
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Order Summary")}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {cartItems.length > 0 && <section className="cart-wrap ptb-40">
                <div className="container">
                    <div className="row cart-block">
                        <div className="col-lg-6">

                            <div className="row mb-20">
                                <div className="col-md-6">
                                    <div className="sm-heading list-disc">{Utils.getLanguageLabel("Delivery address")}</div>
                                    <div className="mt-10">
                                        <div className="xs-heading">{selectedAddress?.full_name} <span className="fw-300">({selectedAddress?.address_type} {Utils.getLanguageLabel("address")})</span></div>
                                        <div className="xs-content mt-1">{selectedAddress?.apt}, {selectedAddress?.formatted_address} ,{selectedAddress?.pincode}</div>
                                        <div className="xs-content mt-0 fw-500">+91 {selectedAddress?.mobile_number}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="sm-heading list-disc">{Utils.getLanguageLabel("Order items")}</div>
                                <div className="white-box pd-0 mt-10">
                                    <div className="cart-main-box">
                                        {renderCart()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="white-box cart-table-block">
                                <div className="cart-pd-20">
                                    <div className="sm-heading fw-500">{Utils.getLanguageLabel("Bill Details")}</div>
                                    <div className="cart-table">
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Sub total")}</td>
                                                    <td className="text-right">{Utils.convertToPriceFormat(calculatePrice().SUB_TOTAL)}</td>
                                                </tr>
                                                {teambuyOffer && <tr>
                                                    <td>{Utils.getLanguageLabel("Team buy discount")}</td>
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT)}</td>
                                                </tr>}
                                                <tr>
                                                    {appliedCoupon && <td>{Utils.getLanguageLabel("Coupon discount")} ({Utils.getLanguageLabel("Coupon Applied")} <span className="fw-700">{appliedCoupon.code}</span>)</td>}

                                                    {!appliedCoupon && <td>{Utils.getLanguageLabel("Coupon discount")}</td>}
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLICABLE_COUPON_DISCOUNT)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Wallet discount")}</td>
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLICABLE_WALLET_DISCOUNT)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Delivery Charge")}</td>
                                                    <td className="red-text text-right">+{Utils.convertToPriceFormat(calculatePrice().APPLICABLE_DELIVERY_CHARGE)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("GST")}</td>
                                                    <td className="red-text text-right">+{Utils.convertToPriceFormat(calculatePrice().APPLIED_GST)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-500">{Utils.getLanguageLabel("Total payable amount")}</td>
                                                    <td className="fw-500 text-right">{Utils.convertToPriceFormat(calculatePrice().TOTAL)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {(Number(calculatePrice().APPLICABLE_COUPON_DISCOUNT) + Number(calculatePrice().APPLICABLE_WALLET_DISCOUNT) + Number(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT)) > 0 && <div className="yellow-bg offer-discount-box plr-20 pt-10 b-radius-0 mt-50">
                                    <span className="sm-heading">{Utils.getLanguageLabel("You saved")} <span className="green-text fw-700">{Utils.convertToPriceFormat(Number(calculatePrice().APPLICABLE_COUPON_DISCOUNT) + Number(calculatePrice().APPLICABLE_WALLET_DISCOUNT) + Number(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT))}</span> {Utils.getLanguageLabel("on this order")}</span>
                                </div>}

                                {hasOutOfStockProduct && <div className="process-checkout-btn text-center mt-30"><button type="button" className="cancel-btn gray-tag-small">{Utils.getLanguageLabel("Some product are Out of stock")}</button></div>}

                                <div className="cart-pd-20 mt-20">
                                    <div className="sm-heading text-start">{Utils.getLanguageLabel("Choose payment mode")}</div>
                                    <div className="custom-radio mt-10">
                                        <input type="radio" id="online" name="payment_mode_radio" onChange={() => setPaymentMode('online')} checked={paymentMode == 'online' ? true : false} />
                                        <label htmlFor="online">{Utils.getLanguageLabel("Online")}</label>
                                    </div>
                                    <div className="custom-radio">
                                        <input type="radio" id="cod" name="payment_mode_radio" onChange={() => setPaymentMode('cod')} checked={paymentMode == 'cod' ? true : false} />
                                        <label htmlFor="cod">{Utils.getLanguageLabel("Cash on Delivery")}</label>
                                    </div>
                                </div>

                                {!hasOutOfStockProduct && <div className="text-center mt-30 d-flex justify-content-center">
                                    <button onClick={() => placeOrder()} className="green-btn process-checkout-btn mx-2 px-3 ">
                                        {Utils.getLanguageLabel("Proceed to payment")}
                                        <Image height={15} width={15} layout="raw" src="/img/white-right-arrow.svg" alt="img/white-right-arrow.svg" />
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            {cartItems.length < 1 && <section className="cart-wrap">
                <div className="empty-cart">
                    <div className="ce-icon text-center">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={140} width={140} quality={100} alt="empty-wishlist" src="/img/empty-cart.png" />
                    </div>
                    <div className="sm-heading text-center mt-30">{Utils.getLanguageLabel("Your cart in empty!")}</div>
                    <div className="xs-heading text-center font-12">{Utils.getLanguageLabel("Shop for some product in order")} <br />
                        {Utils.getLanguageLabel("to purchase them")}</div>
                    <div className="text-center mt-20">
                        <Link passHref href={{ pathname: '/category' }}>
                            <button className="green-btn">{Utils.getLanguageLabel("SHOp NOW")}</button>
                        </Link>
                    </div>
                </div>
            </section>}

            {showLogin && <AuthSideBar />}
            <Feature />
        </>
    )
}