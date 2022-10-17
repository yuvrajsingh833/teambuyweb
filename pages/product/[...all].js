import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";

import Feature from '../../component/feature';
import Loader from '../../component/loader';
import ProductCard from "../../component/productCard";
import RateProductModal from '../../component/rateProductModal';

import { Config } from '../../config/config';
import * as Dates from '../../lib/dateFormatService';
import * as Enums from '../../lib/enums';
import * as Utils from '../../lib/utils';

import AuthSideBar from '../../component/authSidebar';
import * as CheckoutService from "../../services/checkout";
import * as ProductService from "../../services/product";
import * as UserService from "../../services/user";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function ProductDetail(props) {
    const router = useRouter();
    const { all } = router.query
    const BASE_URL = `${Config.BaseURL.fileServer}${Config.FilePath.productBanner}`

    const [isLoading, setIsLoading] = useState(true);
    const [productID, setProductID] = useState();
    const [showLogin, setShowLogin] = useState(false)
    const [productDetail, setProductDetail] = useState({});
    const [showProductDescription, setShowProductDescription] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showThanksModal, setShowThanksModal] = useState(false);

    const [isLiked, setIsLiked] = useState(0);
    const [cartQuantity, setCartQuantity] = useState(0);

    const [comment, setComment] = useState(null);
    const [commentError, setCommentError] = useState(null);
    const [reviewStarCount, setReviewStarCount] = useState(0);

    const getProductDetail = (query) => {

        ProductService.productDetail({ productID: query[1], userType: 'customer' }).then(response => {
            setProductDetail(response.data)
            setIsLiked(response?.data?.is_liked || 0)
            setCartQuantity(response?.data?.cart_quantity || 0)
            setIsLoading(false)
        }).catch(e => {
            console.log(`getProductDetail error : ${e}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        all != undefined && getProductDetail(all)
    }, [all, props])

    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    const setProductCartQuantity = (productId, quantity) => {
        let postParams = { productID: productId, quantity: quantity, cartType: "individual" }
        setCartQuantity(quantity)

        if (user?.token?.length > 0) {
            UserService.updateUserCart(postParams).then(response => {
                CheckoutService.getCart().then(response => {
                    if (response.data.length > 0) {
                        document.getElementById("cartCountImage").src = "/img/cart-active-icon.svg";
                        document.getElementById("cartCountImage").srcset = "/img/cart-active-icon.svg 1x, /img/cart-active-icon.svg 2x";
                        document.getElementById("cartCount").innerHTML = `${response.data.length}`;
                    } else {
                        document.getElementById("cartCountImage").src = "/img/cart-icon.svg";
                        document.getElementById("cartCountImage").srcset = "/img/cart-icon.svg 1x, /img/cart-icon.svg 2x";
                        document.getElementById("cartCount").innerHTML = `0`;
                    }
                }).catch(e => {
                    console.log(`${productId} getCart error : ${e}`)
                })
            }).catch(e => {
                console.log(`${productId} updateUserCart error : ${e}`)
            })
        } else {
            openLogin()
        }
    }

    const renderAddToCartButton = () => {
        if (Number(productDetail.stock) >= Number(productDetail.reserve_stock) && productDetail.stock != 0 && productDetail.reserve_stock != 0) {
            if (user?.token?.length > 0) {
                if (cartQuantity > 0) {
                    return <div className="d-inline-flex align-items-start product-count">
                        <a onClick={() => setProductCartQuantity(productDetail._id, Number(cartQuantity - 1))} style={{ cursor: 'pointer' }} className="add-product-icon">
                            <Image
                                width={40}
                                alt={"add button"}
                                height={40}
                                src={"/img/minus.svg"} />
                        </a>
                        <a className="add-product-icon" style={{ height: '40px', width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F3F3' }}>{cartQuantity}</a>
                        <a onClick={() => setProductCartQuantity(productDetail._id, Number(cartQuantity + 1))} style={{ cursor: 'pointer' }} className="add-product-icon">
                            <Image
                                width={40}
                                alt={"add button"}
                                height={40}
                                src={"/img/plus.svg"} />
                        </a>
                    </div>
                } else {
                    return <button onClick={() => setProductCartQuantity(productDetail._id, Number(cartQuantity + 1))} className="green-btn">
                        <Image alt='add-to-cart' layout='raw' height={20} width={20} src="/img/cart.svg" />
                        {Utils.getLanguageLabel("Add to cart")}
                    </button>
                }
            } else {
                return <button onClick={() => openLogin()} className="green-btn">
                    <Image alt='add-to-cart' layout='raw' height={20} width={20} src="/img/cart.svg" />
                    {Utils.getLanguageLabel("Add to cart")}
                </button>
            }
        } else {
            return <button type="button" className="cancel-btn gray-tag-big">Out of stock</button>
        }
    }

    const renderAverageRatingStars = (data) => {
        const arrayData = [1, 2, 3, 4, 5];
        return (
            <div className="r-rating">
                {arrayData.map((item, index) => {
                    if (parseFloat(item) <= parseFloat(data))
                        return <Image layout='raw' height={10} width={10} key={`product_star_rating_${index}`} src="/img/fill-star.svg" alt='fill-star' />
                    else
                        return <Image layout='raw' height={10} width={10} key={`product_star_rating_${index}`} src="/img/blank-star.svg" alt='blank-star' />
                })}
            </div>
        )
    }

    const renderComments = (data) => {
        return data.map(item => {
            return (<div key={`product_comment_${item.commented_on}_${item.commented_by}`} className="rr-box mt-10">
                {renderAverageRatingStars(item.rating)}
                <div className="r-review fw-500">{item.comment} </div>
                <div className="r-info">{item.commented_by} &bull; {Dates.localDate(item.commented_on)} </div>
            </div>)
        })
    }

    const renderSimilarProducts = (data) => {
        if (data)
            return data.map(item => {
                return <div key={`product_similar_item_${item._id}`}
                    className="item">
                    <ProductCard item={item} showLogin={(value) => { openLogin() }} />
                </div>
            })
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>{productDetail?.name} | Teambuy</title>
            </Head>
            <section className="detail-wrap ptb-30">
                <div className="container">
                    <div className="detail-block">
                        <div className="row product-dtl-block">
                            <div className="col-md-6">
                                <OwlCarousel
                                    className="dtl-product-slider owl-carousel common-dots"
                                    loop={false}
                                    margin={0}
                                    nav={false}
                                    dots={true}
                                    items={1}
                                >{productDetail?.product_images.length > 0 ?
                                    (productDetail.product_images).map((imageItem, index) => {
                                        return <div key={`product_image_${index}`} className="item">
                                            <div className="dtl-img-box">
                                                <Image
                                                    src={BASE_URL + imageItem.file_name}
                                                    alt={imageItem.file_name}
                                                    height={450}
                                                    style={{ objectFit: 'contain' }}
                                                    width={600}
                                                    layout="raw"
                                                />
                                            </div>
                                        </div>
                                    }) : <div className="item">
                                        <div className="dtl-img-box">
                                            <Image alt='default-image' layout='raw' height={120} width={120} style={{ objectFit: 'contain', height: '220px' }} src="/img/default-image.png" />
                                        </div>
                                    </div>}
                                </OwlCarousel>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex product-dtl-heading">
                                    <div>
                                        <div className="dtl-heading">{productDetail?.name} {productDetail?.size} </div>
                                        <div className="xs-heading fw-500">MRP &#8377;{Number(productDetail.business_gst_amount + productDetail.business_price_without_gst).toLocaleString('en-US', { maximumFractionDigits: 2 })} </div>
                                        <div className="mt-6">
                                            <FacebookShareButton
                                                url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}
                                                quote={productDetail.highlight}
                                                hashtag={'#teambuy'}
                                            >
                                                <FacebookIcon size={20} round />
                                            </FacebookShareButton>
                                            <WhatsappShareButton
                                                url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}
                                                title={productDetail.highlight}
                                                separator=":: "
                                            >
                                                <WhatsappIcon size={20} round />
                                            </WhatsappShareButton>
                                            <TwitterShareButton
                                                url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}
                                                title={productDetail.highlight}
                                            >
                                                <TwitterIcon size={20} round />
                                            </TwitterShareButton>
                                            <LinkedinShareButton url={Config.BaseURL.web.replace(/\/$/, "") + router.asPath}>
                                                <LinkedinIcon size={20} round />
                                            </LinkedinShareButton>
                                            <a href="" className="product-wishlist dtl-wishlist"></a>
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className=" lr-box d-flex align-items-center">
                                            <div>{productDetail?.average_rating} <Image alt='star' layout='raw' height={10} width={10} style={{ verticalAlign: 'middle' }} src="/img/fill-star.png" /></div>&nbsp;
                                            <div>{productDetail.product_comments.length}  {Utils.getLanguageLabel("Likes")}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dtl-content mt-20">{productDetail.highlight}</div>
                                <div className="d-inline-flex mt-10">
                                    <div>
                                        <div className="xs-heading mt-20 fw-500">{Utils.getLanguageLabel("Size")}</div>
                                        <div className="d-inline-flex mt-10">
                                            <div className="tags">
                                                <span>{productDetail.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="xs-heading mt-20 fw-500">{Utils.getLanguageLabel("Brand")}</div>
                                        <div className="d-inline-flex mt-10">
                                            <div className="tags">
                                                <span>{productDetail.brand}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dtl-action-block d-flex align-items-center">
                                    <div>
                                        <div className="product-price font-19">MRP ₹380</div>
                                        <div className="special-disc">{Utils.getLanguageLabel("Get on")} <span>₹280</span> {Utils.getLanguageLabel("with team buying")}</div>
                                    </div>
                                    <div className="ml-auto">
                                        {renderAddToCartButton()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mlr-25 mt-20 desc-review-block">
                            <div className="col-md-6 plr-25">
                                <div className="sm-heading">{Utils.getLanguageLabel("Product description")}</div>
                                {(typeof productDetail.description == "object") ?
                                    Object.keys(productDetail.description).map(descriptionItems => {
                                        return (
                                            <div key={`product_${productDetail.name}_description_${descriptionItems}`} className="mt-20">
                                                <div className="xs-heading fw-500">{descriptionItems}</div>
                                                <div className="dtl-content mt-10">{productDetail.description[descriptionItems]}</div>
                                            </div>
                                        )
                                    })
                                    : <div className="dtl-content mt-10"> {productDetail.description}</div>}
                            </div>
                            <div className="col-md-6 plr-25">
                                <div className="d-flex align-items-center">
                                    <div className="sm-heading">{Utils.getLanguageLabel("Reviews & ratings")}</div>
                                    <div className="ml-auto">
                                        <a style={{ cursor: 'pointer' }} onClick={() => setShowRatingModal(true)} className="black-link green-text text-uppercase fw-500">+ {Utils.getLanguageLabel("rate product")}</a>
                                    </div>
                                </div>
                                <div className="rr-total-box">
                                    {renderAverageRatingStars(productDetail.average_rating)}
                                    <div className="r-review fw-500">{productDetail.average_rating} out of 5 ({productDetail?.product_comments?.length} {Utils.getLanguageLabel("rating(s)")})</div>
                                </div>
                                {renderComments(productDetail.product_comments.slice(0, 5))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="similar-product-wrap">
                <div className="container">
                    <div className="heading-flex">
                        <div className="sm-heading">{Utils.getLanguageLabel("Similar products")}</div>
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
                        {renderSimilarProducts(productDetail?.suggested_products)}
                    </OwlCarousel>
                </div>
            </div>
            <Feature />

            {showRatingModal && <RateProductModal
                showModal={showRatingModal}
                productId={productDetail._id}
                onCancelPress={() => { setShowRatingModal(false); document.location.reload() }}
            />}

            {showLogin && <AuthSideBar />}
        </>
    )
}