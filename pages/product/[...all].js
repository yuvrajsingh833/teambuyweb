import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import Feature from '../../component/feature';
import Loader from '../../component/loader';
import ProductCard from "../../component/productCard";
import { Config } from '../../config/appConfig';
import * as Dates from '../../lib/dateFormatService';
import * as Enums from '../../lib/enums';
import * as ProductService from "../../services/product";

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
    const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.productBanner}`

    const [isLoading, setIsLoading] = useState(true);
    const [productID, setProductID] = useState();
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
    }, [props])

    const renderAverageRatingStars = (data) => {
        const arrayData = [1, 2, 3, 4, 5];
        return (
            <div className="r-rating">
                {arrayData.map((item, index) => {
                    if (parseFloat(item) <= parseFloat(data))
                        return <img key={`product_star_rating_${index}`} src="/img/fill-star.svg" />
                    else
                        return <img key={`product_star_rating_${index}`} src="/img/blank-star.svg" />
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
                    <ProductCard item={item} />
                </div>
            })
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>{productDetail?.name} {productDetail?.size} | Teambuy</title>
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
                                            <img src="/img/default-image.png" />
                                        </div>
                                    </div>}
                                </OwlCarousel>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex product-dtl-heading">
                                    <div>
                                        <div className="dtl-heading">{productDetail?.name} {productDetail?.size} </div>
                                        <div className="xs-heading mt-10 fw-500 green-text">{productDetail.business_caret_size} piece per case </div>
                                        <div className="xs-heading fw-500">MRP &#8377;{Number(productDetail.business_gst_amount + productDetail.business_price_without_gst).toLocaleString('en-US', { maximumFractionDigits: 2 })} </div>
                                        <div className="mt-6">
                                            <FacebookShareButton
                                                url={'https://teambuy.co.in/' + router.asPath}
                                                quote={productDetail.highlight}
                                                hashtag={'#teambuy'}
                                            >
                                                <FacebookIcon size={20} round />
                                            </FacebookShareButton>
                                            <WhatsappShareButton
                                                url={'https://teambuy.co.in/' + router.asPath}
                                                title={productDetail.highlight}
                                                separator=":: "
                                            >
                                                <WhatsappIcon size={20} round />
                                            </WhatsappShareButton>
                                            <TwitterShareButton
                                                url={'https://teambuy.co.in/' + router.asPath}
                                                title={productDetail.highlight}
                                            >
                                                <TwitterIcon size={20} round />
                                            </TwitterShareButton>
                                            <LinkedinShareButton url={'https://teambuy.co.in/' + router.asPath}>
                                                <LinkedinIcon size={20} round />
                                            </LinkedinShareButton>
                                            <a href="" className="product-wishlist dtl-wishlist"></a>
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className=" lr-box d-flex align-items-center">
                                            <div>{productDetail?.average_rating} <img style={{ verticalAlign: 'middle' }} src="/img/fill-star.png" /></div>&nbsp;
                                            <div>{productDetail.product_comments.length}  Likes</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dtl-content mt-20">{productDetail.highlight}</div>
                                <div className="d-inline-flex mt-10">
                                    <div>
                                        <div className="xs-heading mt-20 fw-500">Size</div>
                                        <div className="d-inline-flex mt-10">
                                            <div className="tags">
                                                <span>{productDetail.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="xs-heading mt-20 fw-500">Brand</div>
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
                                        <div className="special-disc">Get on <span>₹280</span> with team buying</div>
                                    </div>
                                    <div className="ml-auto">
                                        <button className="green-btn"><img src="/img/cart.svg" /> Add to cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mlr-25 mt-20 desc-review-block">
                            <div className="col-md-6 plr-25">
                                <div className="sm-heading">Product description</div>
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
                                    <div className="sm-heading">Reviews & ratings</div>
                                    <div className="ml-auto">
                                        <a data-bs-toggle="modal" data-bs-target="#rateTheProductModal" className="black-link green-text text-uppercase fw-500">+ rate product</a>
                                    </div>
                                </div>
                                <div className="rr-total-box">
                                    {renderAverageRatingStars(productDetail.average_rating)}
                                    <div className="r-review fw-500">{productDetail.average_rating} out of 5 ({productDetail?.product_comments?.length} rating(s))</div>
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
                        <div className="sm-heading">Similar products</div>
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
        </>
    )
}