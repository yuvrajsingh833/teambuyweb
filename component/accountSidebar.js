import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';

export default function AccountSideBar(props) {
    const router = useRouter();

    useEffect(() => {
    }, [props]);

    return (
        <>
            <ul className="left-menu">
                <li className="lm-back-arrow">
                    <a onClick={() => window.closeUserSideBar()} style={{ cursor: 'pointer' }} className="pl-0">
                        <img src="/img/back-arrow.png" />
                    </a>
                </li>
                <li className={router.asPath == "/account" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account" }}><a ><span className="lm-icon lm-user-icon"></span> Update profile <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/addresses" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/addresses" }}><a ><span className="lm-icon lm-addresses-icon"></span> My addresses <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/notifications" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/notifications" }}><a ><span className="lm-icon lm-notification-icon"></span> Notifications <span className="lm-arrow"></span></a></Link>
                </li>
                <hr className="custom-hr2" />
                <li className={router.asPath == "/account/orders" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/orders" }}><a ><span className="lm-icon lm-order-icon"></span> My orders <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/wallet" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/wallet" }}><a ><span className="lm-icon lm-wallet-icon"></span> My wallet <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/transactions" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/transactions" }}><a ><span className="lm-icon lm-transaction-icon"></span> My transactions <span className="lm-arrow"></span></a></Link>
                </li>
                <hr className="custom-hr2" />
                <li>
                    <Link passHref href={{ pathname: "/account/wallet" }}><a ><span className="lm-icon lm-signout-icon"></span> Sign out <span className="lm-arrow"></span></a></Link>
                </li>
                <div className="mt-10 green-text xs-heading fw-500 text-center">Version 0.0.2</div>
            </ul>
        </>
    )
}