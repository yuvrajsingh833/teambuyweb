import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';
import * as Utils from "../../../lib/utils";

import NoDataFound from "../../../component/nodataFound";
import * as UserService from "../../../services/user";

import AccountSideBar from "../../../component/accountSidebar";

export default function MyAddresses(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [allAddresses, setAllAddresses] = useState([]);

    const getUserSavedAddresses = () => {
        setIsLoading(true)
        UserService.getUserAddresses().then(response => {
            setAllAddresses(response.data)
            setIsLoading(false)
        }).catch(e => {
            setIsLoading(false)
            console.log(`getUserAddresses error : ${e}`)
        })
    }

    const updateUserAddress = (addressID) => {
        console.log("Hello")
        setIsLoading(true)
        UserService.updateUserAddress({ addressID: addressID, primary: "true", deleted: "false" }).then(response => {
            getUserSavedAddresses()
        }).catch(e => {
            setIsLoading(false)
            console.log(`getUserDetail error : ${e}`)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getUserSavedAddresses();
    }, [props])


    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>My Addresses | Teambuy</title>
                <meta name="description" content="My Addresses | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/" }}>
                                    <a>{Utils.getLanguageLabel("Home")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a>{Utils.getLanguageLabel("My account")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("My Addresses")}</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="common-wrap ptb-40">
                <div className="container">
                    <div className="common-flex d-flex">
                        <div className="common-left">
                            <a style={{ cursor: 'pointer' }} onClick={() => window.openUserSideBar()} className="mob-profile-menu"></a>
                            <div className="lm-overflow-bg" onClick={() => window.closeUserSideBar()}></div>
                            <div className="left-menu-box">
                                <AccountSideBar />
                            </div>
                        </div>

                        <div className="common-right">
                            <div className="white-box pd-15">
                                <div className="add-new-box mb-30">
                                    <a style={{ cursor: 'pointer' }} className="white-box blue-box d-block b-none">
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} alt="add-new-location" src="/img/add-new-icon.png" /> {Utils.getLanguageLabel("Add new address")}
                                    </a>
                                </div>
                                {allAddresses.length < 1 &&
                                    <NoDataFound
                                        image="/bgicon/location.png"
                                        title="No Saved Addresses"
                                        subtitle="Please add a new address."
                                    />}
                                {allAddresses.map(item => {
                                    return <div key={`all_saved_address_${item.id}`} className={`white-box address-box mb-20 ${item.is_primary == 1 ? 'selected' : ''}`}>
                                        <input type="radio" name="deliveryAddress" className="addressCheck" />
                                        {item.is_primary == 1 ? <span className="default-tag">{Utils.getLanguageLabel("Default")}</span> : null}
                                        <span className="ad-select-icon"><Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} alt="check-icon" src="/img/sm-check-icon.svg" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="loaction-icon">
                                                <Image layout='raw' style={{ objectFit: 'contain' }} height={45} width={45} alt="location" src="/img/location.png" />
                                            </div>
                                            <div className="pl-15">
                                                <div className="xs-heading fw-500">{item.full_name}</div>
                                                <div className="xs-content mt-15">{item.apt}, {item.formatted_address}, {item.pincode}</div>
                                                <div className="xs-content mt-15 fw-500">+91 {item.mobile_number}</div>
                                            </div>
                                        </div>
                                        {item.is_primary != 1 ? <div className='text-right mt-20'>
                                            <button onClick={() => updateUserAddress(item.id)} type="button" className="green-btn">{Utils.getLanguageLabel("Make Default")}</button>
                                        </div> : null}
                                    </div>
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )
}