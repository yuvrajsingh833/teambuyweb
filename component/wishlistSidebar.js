import React, { useEffect, useState } from "react";
import { ActionCreators } from "../store/actions/index";
import Link from 'next/link'
import Image from 'next/image'

import Loader from './loader'

import * as Utils from "../lib/utils"

import * as UserService from "../services/user";

export default function WishlistSidebar(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [wishlistItems, setWishlistItems] = useState([]);

    const getAllWishlistItems = () => {
        setIsLoading(true)
        UserService.getUserWishlist().then(response => {
            setWishlistItems(response.data)
            setIsLoading(false)
        }).catch(e => {
            setIsLoading(false)
            console.log(`.getUserWishlist error : ${e}`)
        })
    }

    const removeFromWishlist = (productID) => {
        setIsLoading(true)
        UserService.updateUserWishlist({ productID: productID }).then(response => {
            getAllWishlistItems()
        }).catch(e => {
            setIsLoading(false)
            console.log(`.getUserWishlist error : ${e}`)
        })
    }

    const addToCart = (productID) => {
        setIsLoading(true)
        UserService.updateUserCart({ productID: productID, quantity: 1, cartType: "business" }).then(response => {
            UserService.updateUserWishlist({ productID: productID }).then(response => {
                Alert.success("Item moved to cart", null, "OK")
                getAllWishlistItems()
            }).catch(e => {
                setIsLoading(false)
                console.log(`.getUserWishlist error : ${e}`)
            })
        }).catch(e => {
            setIsLoading(false)
            console.log(`.getUserWishlist error : ${e}`)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getAllWishlistItems();
    }, [props])

    return (
        <>
            <section className="sidebar-block" id="wishlistSidebar">
                {wishlistItems.length > 0 ? <div className="plr-13">
                    <div className="xs-heading fw-500 mt-20">My wishlist</div>
                    {isLoading ? <Loader /> : wishlistItems.map(item => {
                        if (item?.product_info) {
                            let productDetail = item.product_info;
                            return <div key={`wishlist_item_${item.id}`} className="wishlist-list mt-50">
                                <div className="white-box wishlist-box">
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
                                            <div className="d-flex">
                                                <div>
                                                    <div className="xs-heading fw-500">{productDetail.name}</div>
                                                    <div className="weight-count">{productDetail.size}</div>
                                                </div>
                                                <div className="product-price ml-auto mt-0">₹{productDetail.gst_amount + productDetail.price_without_gst}</div>
                                            </div>
                                            <div className="d-flex align-items-center mt-10">
                                                <div>
                                                    {(Number(item.stock) >= Number(item.reserve_stock)) ?
                                                        <button onClick={() => addToCart(productDetail._id)} className="green-btn wishlist-btn"><img src="/img/cart.svg" /> move to cart</button> : <p style={{ fontSize: '14px', marginTop: '14px' }} >Product out of stock</p>}
                                                </div>
                                                <div className="ml-auto">
                                                    <button onClick={() => removeFromWishlist(productDetail._id)} className="red-btn wishlist-btn">remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        }
                    })}
                </div> :
                    <div className="plr-27">
                        <div className="xs-heading fw-500 mt-20">My wishlist</div>
                        <div className="mt-90 empty-wishlist text-center">
                            <img src="/img/empty-wishlist.png" />
                        </div>
                        <div className="xs-heading fw-500 mt-20 text-center">Your wishlist in empty!</div>
                        <div className="xs-heading fw-400 text-center font-12">Choose from our list of product for your <br />future purchase</div>
                        <div className="text-center mt-30">
                            <Link passHref href={{ pathname: '/category' }}>
                                <button className="green-btn">EXPLORE NOW</button>
                            </Link>
                        </div>
                    </div>}
            </section>
        </>
    )
}