import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'

import * as Utils from '../lib/utils'
import * as Enums from '../lib/enums'

import { Config } from '../config/config';

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function PromotionalOffers(props) {

    const [bannerData, setBannerData] = useState(props.bannerData)

    useEffect(() => {
        setBannerData(props.bannerData)
    }, [props]);

    const renderBanner = (data) => {
        const BASE_URL = `${Config.BaseURL.fileServer}${Config.FilePath.promotionalBanner}`

        return data.map(item => {
            return <div key={`top_banners_${item.id}`}
                className="item">
                <div className="top-banner-box" style={{
                    backgroundImage: `url(${BASE_URL + item.background_image})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                }}>
                    <div className="tb-content">
                        <div className="md-heading" style={{ color: item.heading_color }}>{item.heading}</div>
                        <div className="sm-subheading mt-10" style={{ color: item.sub_heading_color }}>{item.sub_heading}</div>
                        {item.button_text ? <div className="mt-20">
                            {(item.category_id && item.category_id != 0) ? <Link
                                passHref
                                href={{
                                    pathname: '/category/[id]/[name]',
                                    query: { id: item.id, name: 'cat' },
                                }}
                            >
                                <a className="sm-green-btn">{item.button_text}</a></Link> : item.external_link && <Link passHref href={item.external_link}> <a className="sm-green-btn">{item.button_text}</a></Link>}

                        </div> : null}
                        <div className="tb-img">
                            <Image
                                alt={item.heading}
                                layout="fixed"
                                objectFit="contain"
                                width={200}
                                height={200}
                                src={BASE_URL + item.icon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        })
    }

    return (
        <section className="top-banners-wrap ptb-50">
            <div className="container">
                <OwlCarousel
                    className="top-banner-slider owl-carousel common-navs"
                    loop={false}
                    margin={15}
                    nav={true}
                    dots={false}
                    responsiveClass={true}
                    responsive={Enums.OwlCarouselSlider.topBannerSlider}
                >
                    {renderBanner(bannerData)}
                </OwlCarousel>
            </div>
        </section>
    )
}