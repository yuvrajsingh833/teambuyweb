import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'

import * as Utils from "../lib/utils"

import * as MasterService from "../services/master";

export default function Navbar(props) {
    const userData = useSelector(state => state.userData)
    const user = userData?.userData
    global.user = userData?.userData

    const [isLoading, setIsLoading] = useState(true)
    const [shortAddress, setShortAddress] = useState(null)
    const [fullAddress, setFullAddress] = useState(null)
    const [locationError, setLocationError] = useState(null)
    const [allLanguages, setAllLanguages] = useState([]);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError(Utils.getLanguageLabel("Your browser doesn't support geolocation. Please update your browser."))
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                MasterService.reverseGeoLocation({ lat: position?.coords?.latitude, long: position?.coords?.longitude }).then(response => {
                    setShortAddress(response.data.additionalInformation.address_components[0].long_name)
                    setFullAddress(response.data.formattedAddress)
                    getAllLanguages()
                }).catch(e => {
                    console.log(`getLocation error : ${e}`)
                    getAllLanguages()
                })
            }, () => {
                setLocationError(Utils.getLanguageLabel("Please enable the geolocation on your browser."))
                getAllLanguages()
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
        getLocation()
    }, [props])

    const changeSelectedLanguage = (language) => {
        Utils.saveStateAsyncStorage(language, "defaultLanguage");
        window.location.reload();
    }

    if (isLoading) return <header />

    return (
        <section className="header-wrap-block">
            <header className="header-wrap">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="main-logo nav-fl-1 for-desktop">
                            <Link passHref href="/"><a><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={130} alt="main-logo" src="/img/logo.svg" /></a></Link>
                        </div>
                        <div className="main-logo for-tab">
                            <Link passHref href="/"><a><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={40} alt="main-logo" src="/img/logo-small.svg" /></a></Link>
                        </div>
                        <div className="header-address d-flex align-items-center nav-fl-2">
                            {locationError ? <div className="had-area-desc">{locationError}</div> : <>
                                <div className="had-icon">
                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} src="/img/location.svg" alt="location-icon" />
                                </div>
                                <div className="had-location">
                                    <div className="had-area-name">{Utils.truncateString(shortAddress, 20)}</div>
                                    <hr className="separator for-desktop" />
                                    <div className="had-area-desc">{Utils.truncateString(fullAddress, 25)}</div>
                                </div>
                            </>}

                        </div>

                        <div className="search-box nav-fl-6">
                            <input type="text" className="search-input" placeholder={Utils.getLanguageLabel("Search Store")} />
                            <span className="search-icon"></span>
                        </div>

                        <div className="search-for-mobile">
                            <a href="#" className="mobile-search">
                                <Image layout='raw' style={{ objectFit: 'contain' }} height={15} width={15} alt="search" src="/img/search.svg" />
                            </a>
                        </div>

                        <div className="account-wish-block nav-fl-1">
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
                                    <a style={{ cursor: 'pointer' }} onClick={() => window.openWishlistSideBar()}>
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="wishlist-icon" src="/img/wishlist-icon.svg" /></a> :
                                    <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()}>
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="wishlist-icon" src="/img/wishlist-icon.svg" /></a>
                                }
                            </div>

                            <div className="px-2">
                                {user?.token?.length > 0 ?
                                    <Link passHref href="/account">
                                        <a style={{ cursor: 'pointer' }}><Image layout='raw' style={{ objectFit: 'contain' }} height={20} width={20} alt="lm-user" src="/img/user-icon.svg" /></a>
                                    </Link> :
                                    <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} ><Image layout='raw' style={{ objectFit: 'contain' }} height={18} width={18} alt="lm-user" src="/img/lm-user.svg" /></a>
                                }
                            </div>
                        </div>

                        <div className="cart-block nav-fl-1">
                            {user?.token?.length > 0 ?
                                <a style={{ cursor: 'pointer' }} className="cart-box">
                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={15} width={15} alt="cart-icon" src="/img/cart-icon.svg" /> 0 Items
                                </a> :
                                <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} className="cart-box">
                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={15} width={15} alt="cart-icon" src="/img/cart-icon.svg" /> 0 Items
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </section>
    )
}
