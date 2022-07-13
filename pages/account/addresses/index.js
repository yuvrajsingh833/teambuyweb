import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import { useSnackbar } from 'react-simple-snackbar';
import { ActionCreators } from "../../../store/actions/index";

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';

import * as UserService from "../../../services/user";

import * as Utils from "../../../lib/utils";
import * as Validations from "../../../lib/validation";

import AccountSideBar from "../../../component/accountSidebar";
import { Config } from '../../../config/appConfig';

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
            console.log(`getUserDetail error : ${e}`)
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
                                    <a>Home</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a >My account</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">My Addresses</li>
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
                                        <img src="/img/add-new-icon.png" /> Add new address
                                    </a>
                                </div>
                                {allAddresses.map(item => {
                                    return <div key={`all_saved_address_${item.id}`} className={`white-box address-box mb-20 ${item.is_primary == 1 ? 'selected' : ''}`}>
                                        <input type="radio" name="deliveryAddress" className="addressCheck" />
                                        {item.is_primary == 1 ? <span className="default-tag">Default</span> : null}
                                        <span className="ad-select-icon"><img src="/img/sm-check-icon.svg" /></span>
                                        <div className="d-flex align-items-center">
                                            <div className="loaction-icon">
                                                <img src="/img/location.png" />
                                            </div>
                                            <div className="pl-15">
                                                <div className="xs-heading fw-500">{item.full_name}</div>
                                                <div className="xs-content mt-15">{item.apt}, {item.formatted_address}, {item.pincode}</div>
                                                <div className="xs-content mt-15 fw-500">+91 {item.mobile_number}</div>
                                            </div>
                                        </div>
                                        {item.is_primary != 1 ? <div className='text-right mt-20'>
                                            <button onClick={() => updateUserAddress(item.id)} type="button" className="green-btn">Make Default</button>
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