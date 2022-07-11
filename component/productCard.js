import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import * as Utils from '../lib/utils'
import * as UserService from "../services/user";

export default function ProductCard({ item }) {
    const [cartQuantity, setCartQuantity] = useState(item.cart_quantity);
    const [isLiked, setIsLiked] = useState(item.is_liked);

    const setProductLike = (productId) => {
        if (userData?.token?.length > 0) {
            setIsLiked(!isLiked)

            UserService.updateUserWishlist({ productID: productId }).then((response) => { console.log(response) }).catch(e => {
                console.log(`${productId} updateUserWishlist error : ${e}`)
            })
        } else {
            console.log("Please login fiorst")
        }
    }

    useEffect(() => {
        setCartQuantity(item.cart_quantity)
        setIsLiked(item.is_liked)
    }, [item])

    return (
        <div className="white-box">
            <a onClick={() => setProductLike(item._id)} style={{ cursor: 'pointer', position: 'absolute', zIndex: 300 }} className={`product-wishlist ${isLiked ? 'selected' : ''}`}></a>
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
                    <div className="ml-auto">
                        <a href="#" className="add-product-icon">
                            <Image
                                width={40}
                                alt={"add button"}
                                height={40}
                                src={"/img/md_add_button.svg"} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}