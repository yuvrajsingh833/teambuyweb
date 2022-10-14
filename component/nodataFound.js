import React from "react"
import Image from 'next/image'
import Link from 'next/link'
import * as Utils from "../lib/utils";

const NoDataFound = ({ title = "Oops! No product", subtitle = "Sorry no product in this selection. Please try different filters or category", image = "/bgicon/no-product.png", size = 100, showButton = false }) => {
    return (
        <section className="cart-wrap">
            <div className="empty-cart">
                <div className="ce-icon text-center">
                    <Image
                        layout="raw"
                        alt="NoDataFound"
                        style={{ objectFit: 'contain', maxHeight: `${size}px` }}
                        width={200}
                        height={200}
                        src={image}
                        quality={100}
                    />
                </div>
                <div className="sm-title mt-30 text-center" dangerouslySetInnerHTML={{ __html: Utils.getLanguageLabel(title) }} />
                <div className="xs-title font-12 text-center" dangerouslySetInnerHTML={{ __html: Utils.getLanguageLabel(subtitle) }} />
                {showButton && <div className="text-center mt-30">
                    <Link passHref href={{ pathname: '/category' }}>
                        <button className="green-btn">{Utils.getLanguageLabel("EXPLORE NOW")}</button>
                    </Link>
                </div>}
            </div>
        </section>
    );
};

export default NoDataFound;
