import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { ActionCreators } from "../store/actions/index";

import AuthSideBar from './authSidebar'

import * as Utils from "../lib/utils"

import * as MasterService from "../services/master";
import * as UserService from "../services/user";
import WishlistSidebar from "./wishlistSidebar";

export default function Navbar(props) {
    const userData = useSelector(state => state.userData)
    const user = userData?.userData
    global.user = userData?.userData

    const [isLoading, setIsLoading] = useState(true)
    const [showLogin, setShowLogin] = useState(false)
    const [showWishlist, setShowWishlist] = useState(false)
    const [shortAddress, setShortAddress] = useState(null)
    const [fullAddress, setFullAddress] = useState(null)
    const [locationError, setLocationError] = useState(null)
    const [allLanguages, setAllLanguages] = useState([]);

    const getUserInfo = () => {
        global?.user?.token?.length > 0 && UserService.getUserDetail().then(response => {
            let oldUserData = JSON.parse(JSON.stringify(global.user));
            let newUserData = JSON.parse(JSON.stringify(response.data));

            let mergeData = { ...oldUserData, ...newUserData }

            global.user = mergeData;
            Utils.saveStateAsyncStorage({ userData: mergeData });
            ActionCreators.setLoggedInUserData(mergeData)
        }).catch(error => console.log(error))

        getLocation()
    }

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError(Utils.getLanguageLabel("Your browser doesn't support geolocation. Please update your browser."))
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                MasterService.reverseGeoLocation({ lat: position?.coords?.latitude, long: position?.coords?.longitude }).then(response => {
                    setShortAddress(response.data.additionalInformation.address_components[0].long_name)
                    setFullAddress(response.data.formattedAddress)
                }).catch(e => {
                    console.log(`getLocation error : ${e}`)
                })
            }, () => {
                setLocationError(Utils.getLanguageLabel("Please enable the geolocation on your browser."))
            });
        }
    }

    const getAllLanguages = () => {
        MasterService.languages().then(response => {
            setAllLanguages(response.data)
            MasterService.languagesLabel().then(response => {
                Utils.saveStateAsyncStorage(response.data, "languageLabelData")
                setIsLoading(false)
            }).catch(e => {
                setIsLoading(false)
                console.log(`languagesLabel : ${e}`)
            })
        }).catch(e => {
            setIsLoading(false)
            console.log(`languages : ${e}`)
        })
    }

    useEffect(() => {
        getUserInfo()
        getAllLanguages()
    }, [props])

    const changeSelectedLanguage = (language) => {
        Utils.saveStateAsyncStorage(language, "defaultLanguage");
        window.location.reload();
    }

    const openLogin = () => {
        setShowLogin(true);
        setTimeout(() => { window.openLoginSideBar() }, 300)
    }

    const openWishlist = () => {
        setShowWishlist(true);
        setTimeout(() => { window.openWishlistSideBar() }, 300)
    }

    if (isLoading) return <header />

    return (
        <>
            <section className="header-wrap-block fixed-top">
                <header className="header-wrap">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="main-logo logo-nav-small for-desktop">
                                <Link passHref href="/"><a><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={130} alt="main-logo" src="/img/logo.svg" /></a></Link>
                            </div>

                            <div className="main-logo for-tab">
                                <Link passHref href="/"><a><Image layout='raw' style={{ objectFit: 'contain', borderRadius: '4px' }} height={40} width={40} alt="main-logo" src="/img/logo-small.svg" /></a></Link>
                            </div>

                            <div className="header-address d-flex align-items-center location-nav">
                                {locationError ? <div className="had-area-desc had-area-desc-error">{locationError}</div> : <>
                                    <div className="had-icon">
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} src="/img/location.svg" alt="location-icon" />
                                    </div>
                                    <div className="had-location">
                                        <div className="had-area-name">{Utils.truncateString(shortAddress, 30)}</div>
                                        <hr className="separator for-desktop" />
                                        <div className="had-area-desc">{Utils.truncateString(fullAddress, 25)}</div>
                                    </div>
                                </>}
                            </div>

                            <div className="search-box search-block-nav">
                                <form action="/search">
                                    <input type="text" name="searchText" className="search-input" placeholder={Utils.getLanguageLabel("Search Store")} />
                                    <span className="search-icon"></span>
                                </form>
                            </div>

                            <div className="account-wish-block account-wishlist-nav">
                                <div className="px-2 dropdown">
                                    <a style={{ cursor: 'pointer' }} onClick={() => window.openLanguageDropDown()} className="dropbtn">
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="wishlist-icon" src="/img/language-selection.svg" /></a>

                                    <div id="languageDropDown" className="dropdown-content">
                                        {allLanguages.map((item, index) => {
                                            return <a key={`${item}_${index}`} onClick={() => { changeSelectedLanguage(item.language_code) }} style={{ cursor: 'pointer' }}>{item.language_code}</a>
                                        })}

                                    </div>
                                </div>

                                <div className="px-2">
                                    {user?.token?.length > 0 ?
                                        <a style={{ cursor: 'pointer' }} onClick={() => openWishlist()}>
                                            <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="wishlist-icon" src={global.user.wishlistCount > 0 ? "/img/wishlist-active-icon.svg" : "/img/wishlist-icon.svg"} /></a> :
                                        <a style={{ cursor: 'pointer' }} onClick={() => openLogin()}>
                                            <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="wishlist-icon" src="/img/wishlist-icon.svg" /></a>
                                    }
                                </div>

                                <div className="px-2">
                                    {user?.token?.length > 0 ?
                                        <Link passHref href="/account">
                                            <a style={{ cursor: 'pointer' }}><Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="lm-user" src="/img/user-icon.svg" /></a>
                                        </Link> :
                                        <a style={{ cursor: 'pointer' }} onClick={() => openLogin()} ><Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="lm-user" src="/img/user-icon.svg" /></a>
                                    }
                                </div>
                            </div>

                            <div className="cart-block cart-block-nav">
                                {user?.token?.length > 0 ?
                                    <Link passHref href="/cart">
                                        <a className="cart-box">
                                            <Image id='cartCountImage' layout='raw' style={{ objectFit: 'contain' }} height={15} width={15} alt="cart-icon" src={global.user.cartCount > 0 ? "/img/cart-active-icon.svg" : "/img/cart-icon.svg"} />  <span id='cartCount' >{global.user.cartCount || 0}</span> Item(s)
                                        </a>
                                    </Link> :
                                    <a style={{ cursor: 'pointer' }} onClick={() => openLogin()} className="cart-box">
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={15} width={15} alt="cart-icon" src="/img/cart-icon.svg" /> 0 Items
                                    </a>
                                }
                            </div>
                        </div>
                    </div>
                </header>
                {showLogin && <AuthSideBar />}
                {showWishlist && <WishlistSidebar />}
            </section>
            <section className="nav-breaker"></section>
        </>

    )
}
