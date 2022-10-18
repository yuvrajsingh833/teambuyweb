import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Loader from '../../component/loader';

import { Config } from '../../config/config';
import * as Utils from "../../lib/utils";

import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import { useRouter } from 'next/router';
import AuthSideBar from "../../component/authSidebar";
import Feature from "../../component/feature";
import * as CheckoutService from "../../services/checkout";
import * as MasterService from "../../services/master";
import * as PaymentService from "../../services/payment";
import * as UserService from "../../services/user";

export default function CheckoutPage(props) {
    const couponApplied = Utils.getStateAsyncStorage("appliedCoupon")

    const router = useRouter();

    const userData = useSelector(state => state.userData)
    const user = userData?.userData
    global.user = userData?.userData

    const [showLogin, setShowLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState((couponApplied && Object.keys(couponApplied).length > 0) ? couponApplied : null);

    const [showClearCartAlert, setShowClearCartAlert] = useState(false)

    const [cartItems, setCartItems] = useState([]);

    const [GSTAmount, setGSTAmount] = useState(0);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [couponDiscount, setCouponDiscount] = useState(0);

    const [hasOutOfStockProduct, setHasOutOfStockProduct] = useState(false);

    const [teambuyOfferPrice, setTeambuyOfferPrice] = useState(0);


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

        if (global?.user?.token?.length > 0) {
            getAllCartItems()
        } else {
            openLogin()
        }
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
        let appliedTeambuyDiscount = teambuyOfferPrice;

        /** Delivery charge calculation */
        let appliedDeliveryCharges = deliveryCharge
        if (Number(subTotal) >= Number(minCartForFreeDelivery)) {
            appliedDeliveryCharges = 0
        }

        /** Total payable price calculation */
        let totalPrice = (Number(subTotal) + Number(appliedDeliveryCharges) + Number(appliedGSTAmount)) - (Number(appliedDiscountAmount) + Number(appliedWalletAmount))

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

    const clearUserCart = () => {
        setShowClearCartAlert(false)
        setIsLoading(true)
        UserService.clearUserCart().then(response => {
            setIsLoading(false)
            getAllCartItems()
        }).catch(e => {
            console.log(`clearUserCart error : ${e}`)
            setIsLoading(false)
            getAllCartItems()
        })
    }

    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    const setProductCartQuantity = (productId, quantity) => {
        let postParams = { productID: productId, quantity: quantity, cartType: "individual" }
        UserService.updateUserCart(postParams).then(response => {
            getAllCartItems()
        }).catch(e => {
            console.log(`${productId} updateUserCart error : ${e}`)
        })
    }

    const renderCart = () => {
        return cartItems.map((item, index) => {
            let productDetail = item.product_info;

            return <div key={`cart_item_${item.id}_${index}`} className="white-box">
                <div className="d-flex to-product-flex">
                    <div className="product-img">
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
                                <div className="xs-heading fw-500">{productDetail.name}</div>
                                <div className="weight-count">{productDetail.size}</div>
                                <div className="product-price ml-auto mt-0">{Utils.convertToPriceFormat(productDetail.gst_amount + productDetail.price_without_gst)}</div>
                                {productDetail.teambuy_offer_price > 0 && <div className="special-disc">Save {Utils.convertToPriceFormat(productDetail.teambuy_offer_price)} on group purchase</div>}

                                <div className="ml-auto px-10">
                                    <div className="countItem md-countItem">
                                        <span onClick={() => setProductCartQuantity(productDetail._id, Number(item.quantity - 1))} className="btn-minus">-</span>
                                        <input value={item.quantity} className="count" onChange={(event) => { }} />
                                        <span onClick={() => setProductCartQuantity(productDetail._id, Number(item.quantity + 1))} className="btn-plus">+</span>
                                    </div>
                                </div>
                            </div>

                            {!(Number(productDetail.stock) >= Number(productDetail.reserve_stock) && Number(productDetail.stock) != 0) && <div className="ml-auto"><button type="button" className="cancel-btn gray-tag-small">Out of stock</button></div>}

                            {(Number(productDetail.stock) >= Number(productDetail.reserve_stock) && Number(productDetail.stock) != 0) && <div className="ml-auto">
                                {productDetail.discount > 0 && <div className="product-price font-19"><span className="cut-price">{Utils.convertToPriceFormat(productDetail.gst_amount + productDetail.price_without_gst)}</span> {Utils.convertToPriceFormat((productDetail.gst_amount + productDetail.price_without_gst - productDetail.discount) * item.quantity)}</div>}

                                {productDetail.discount < 1 && <div className="product-price font-19">{Utils.convertToPriceFormat((productDetail.gst_amount + productDetail.price_without_gst - productDetail.discount) * item.quantity)}</div>}
                            </div>}
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
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Cart")}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {cartItems.length > 0 && <section className="cart-wrap ptb-40">
                <div className="container">
                    <div className="row cart-block">
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
                                                {/* <tr>
                                                    <td>{Utils.getLanguageLabel("Team buy discount")}</td>
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT)}</td>
                                                </tr> */}
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Coupon discount")}</td>
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

                                {(Number(calculatePrice().APPLICABLE_COUPON_DISCOUNT) + Number(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT)) > 0 && <div className="yellow-bg offer-discount-box plr-20 ptb-10 b-radius-0 mt-50">
                                    <span className="sm-heading">You saved <span className="green-text fw-700">{Utils.convertToPriceFormat(Number(calculatePrice().APPLICABLE_COUPON_DISCOUNT) + Number(calculatePrice().APPLICABLE_WALLET_DISCOUNT))}</span> on this order</span>
                                </div>}
                            </div>
                        </div>

                        <div className="col-lg-6">

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