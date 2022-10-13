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
    const [languageLabelData, setLanguagesData] = useState([]);

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
            Utils.saveStateAsyncStorage(response.data, "defaultLanguage")
            MasterService.languagesLabel().then(response => {
                setLanguagesData(response.data)

                console.log(":response.data", response.data)
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
        getAllLanguages()
    }, [props])

    if (isLoading) return <header />

    return (
        <section className="header-wrap-block">
            <header className="header-wrap">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="main-logo">
                            <Link passHref href="/"><a><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={130} alt="main-logo" src="/img/logo.svg" /></a></Link>
                        </div>
                        <div className="header-address d-flex align-items-center">
                            {locationError ? <div className="had-area-desc">{locationError}</div> : <>
                                <div className="had-icon">
                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={30} width={30} src="/img/location.svg" alt="location-icon" />
                                </div>
                                <div className="had-location">
                                    <div className="had-area-name">{shortAddress}</div>
                                    <hr className="separator" />
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
                                {user?.token?.length > 0 ?
                                    <li>
                                        <Link passHref href="/account">
                                            <a style={{ cursor: 'pointer' }}>{Utils.getLanguageLabel("My Account")}</a>
                                        </Link></li> :
                                    <li>
                                        <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} >{Utils.getLanguageLabel("Login")}</a>
                                    </li>
                                }
                            </ul>
                        </div>

                        <div className="search-for-mobile">
                            <a href="#" className="mobile-search">
                                <Image layout='raw' style={{ objectFit: 'contain' }} height={15} width={15} alt="search" src="/img/search.svg" />
                            </a>
                        </div>

                        <div className="login-for-mobile">
                            {user?.token?.length > 0 ?
                                <Link passHref href="/account">
                                    <a style={{ cursor: 'pointer' }}>{Utils.getLanguageLabel("My Account")}</a>
                                </Link> :
                                <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} >{Utils.getLanguageLabel("Login")}</a>
                            }
                        </div>

                        <div className="wish-block">
                            {user?.token?.length > 0 ?
                                <a style={{ cursor: 'pointer' }} onClick={() => window.openWishlistSideBar()} className='wishlist-icon '></a> :
                                <a style={{ cursor: 'pointer' }} onClick={() => window.openLoginSideBar()} className={'wishlist-icon '}></a>
                            }
                        </div>

                        <div className="cart-block">
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
