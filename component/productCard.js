import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'

import * as Utils from '../lib/utils'

import * as UserService from "../services/user";
import * as CheckoutService from "../services/checkout";

export default function ProductCard({ item, showLogin }) {

    console.log(item)

    const userData = useSelector(state => state.userData)
    const user = userData?.userData

    const [cartQuantity, setCartQuantity] = useState(item.cart_quantity);
    const [isLiked, setIsLiked] = useState(item.is_liked);

    const setProductLike = (productId) => {
        if (user?.token?.length > 0) {
            setIsLiked(!isLiked)
            UserService.updateUserWishlist({ productID: productId }).then((response) => { console.log(response) }).catch(e => {
                console.log(`${productId} updateUserWishlist error : ${e}`)
            })
        } else {
            openLogin();
        }
    }

    useEffect(() => {
        setCartQuantity(item.cart_quantity)
        setIsLiked(item.is_liked)
    }, [item])

    const openLogin = () => {
        showLogin(true)
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
        if (item.stock < item.reserve_stock) {
            return <button type="button" className="cancel-btn gray-tag-big">Out of stock</button>
        }

        if (user?.token?.length > 0) {
            if (cartQuantity > 0) {
                return <div className="ml-auto d-inline-flex align-items-start product-count">
                    <a onClick={() => setProductCartQuantity(item._id, Number(cartQuantity - 1))} style={{ cursor: 'pointer' }} className="add-product-icon">
                        <Image
                            width={30}
                            alt={"add button"}
                            height={30}
                            src={"/img/minus.svg"} />
                    </a>
                    <a className="add-product-icon" style={{ height: '30px', width: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F3F3' }}>{cartQuantity}</a>
                    <a onClick={() => setProductCartQuantity(item._id, Number(cartQuantity + 1))} style={{ cursor: 'pointer' }} className="add-product-icon">
                        <Image
                            width={30}
                            alt={"add button"}
                            height={30}
                            src={"/img/plus.svg"} />
                    </a>
                </div>
            } else {
                return <div className="ml-auto">
                    <a onClick={() => setProductCartQuantity(item._id, Number(cartQuantity + 1))} style={{ cursor: 'pointer' }} className="add-product-icon">
                        <Image
                            width={30}
                            alt={"add button"}
                            height={30}
                            src={"/img/md_add_button.svg"} />
                    </a>
                </div>
            }
        } else {
            return <div className="ml-auto ">
                <a onClick={() => openLogin()} style={{ cursor: 'pointer' }} className="add-product-icon">
                    <Image
                        width={30}
                        quality={100}
                        alt={"add button"}
                        height={30}
                        src={"/img/plus.svg"} />
                </a>
            </div>
        }
    }

    return (
        <>
            <div className="white-box">
                <a onClick={() => setProductLike(item._id)} style={{ cursor: 'pointer', position: 'absolute', zIndex: 1 }} className={`product-wishlist ${isLiked ? 'selected' : ''}`}></a>
                <Link Link
                    key={`product_item_${item._id}`}
                    passHref
                    href={{
                        pathname: '/product/[name]/[id]',
                        query: { id: item._id, name: Utils.convertToSlug(item.name) },
                    }}
                >
                    <a>
                        <div className="product-img">
                            <Image
                                src={Utils.generateProductImage(item)}
                                alt={item?.name}
                                layout="raw"
                                height={200}
                                width={200}
                                className={'common-product-image'}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                    </a>
                </Link>
                <div className="product-content">
                    <div className="xs-heading text-ellipsis">{item.name}</div>
                    <div className="weight-count mt-1">{item.size}</div>
                    <div className="d-flex align-items-center mt-10">
                        <div className="product-price">&#8377;{Number(item.gst_amount + item.price_without_gst).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                        {renderAddToCartButton()}
                    </div>
                </div>

            </div>

        </>
    )
}