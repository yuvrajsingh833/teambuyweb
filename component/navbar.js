import React, { useEffect, useState } from "react";
import Link from 'next/link'
import { useSelector } from 'react-redux'

import * as Utils from "../lib/utils"

import * as MasterService from "../services/master";

export default function Navbar(props) {
    const appData = useSelector(state => state.appData)
    const userData = appData?.userData
    global.userData = appData?.userData

    const [isLoading, setIsLoading] = useState(true)
    const [shortAddress, setShortAddress] = useState(null)
    const [fullAddress, setFullAddress] = useState(null)
    const [locationError, setLocationError] = useState(null)

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Your browser doesn't support geolocation. Please update your browser.")
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                MasterService.reverseGeoLocation({ lat: position?.coords?.latitude, long: position?.coords?.longitude }).then(response => {
                    setShortAddress(response.data.additionalInformation.address_components[0].long_name)
                    setFullAddress(response.data.formattedAddress)
                }).catch(e => {
                    console.log(`getLocation error : ${e}`)
                })
            }, () => {
                setLocationError("Please enable the geolocation on your browser.")
            });
        }
    }

    useEffect(() => {
        getLocation()
        setTimeout(() => { setIsLoading(false) }, 2000)
    }, [props])

    if (isLoading) return <header />
    return (
        <header className="header-wrap">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="main-logo">
                        <Link passHref href="/"><a><img src="/img/logo.svg" /></a></Link>
                    </div>
                    <div className="header-address d-flex align-items-center">
                        {locationError ? <div className="had-area-desc">{locationError}</div> : <>
                            <div className="had-icon">
                                <img src="/img/location.svg" />
                            </div>
                            <div className="had-location">
                                <div className="had-area-name">{shortAddress}</div>
                                <div className="had-area-desc">{Utils.truncateString(fullAddress, 50)}</div>
                            </div>
                        </>}

                    </div>
                    <div className="search-box">
                        <input type="text" className="search-input" placeholder="Search Store" />
                        <span className="search-icon"></span>
                    </div>
                    <div className="main-menu">
                        <ul>
                            <li><Link passHref href="/category"><a href="#">Category</a></Link></li>
                            {userData?.token?.length > 0 ? null : <li><a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} className="jq_login">Login</a></li>}
                        </ul>
                    </div>

                    <div className="search-for-mobile">
                        <a href="#" className="mobile-search"><img src="/img/search.svg" /></a>
                    </div>

                    <div className="login-for-mobile">
                        {userData?.token?.length > 0 ? null : <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} className="jq_login">Login</a>}
                    </div>

                    <div className="wish-block">
                        {userData?.token?.length > 0 ? <a style={{ cursor: 'pointer' }} className='wishlist-icon'></a> : <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} className={'wishlist-icon jq_login'}></a>}
                    </div>
                    <div className="cart-block">
                        {userData?.token?.length > 0 ? <a style={{ cursor: 'pointer' }} className="cart-box"> <img src="/img/cart-icon.svg" /> 0 Items</a> : <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} className="cart-box jq_login"> <img src="/img/cart-icon.svg" /> 0 Items</a>}
                    </div>
                </div>
            </div>
        </header>
    )
}
