import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import * as Utils from "../lib/utils";
import { deleteCookie } from 'cookies-next';
import { ConfirmModal } from './modal';

export default function AccountSideBar(props) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const makeUserLogout = () => {
        setShowModal(false)
        deleteCookie("appData")
        if (typeof window !== 'undefined') {
            localStorage.setItem("appData", JSON.stringify({}));
        }
        window.location.reload()
    }

    useEffect(() => {
        setShowModal(false)
    }, [props]);

    return (
        <>
            <ul className="left-menu">
                <li className="lm-back-arrow">
                    <a onClick={() => window.closeUserSideBar()} style={{ cursor: 'pointer' }} className="pl-0">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={12} width={12} src="/img/back-arrow.png" alt='back-arrow.png' />
                    </a>
                </li>
                <li className={router.asPath == "/account" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account" }}><a ><span className="lm-icon lm-user-icon"></span> {Utils.getLanguageLabel("Update profile")} <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/addresses" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/addresses" }}><a ><span className="lm-icon lm-addresses-icon"></span> {Utils.getLanguageLabel("My addresses")} <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/notifications" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/notifications" }}><a ><span className="lm-icon lm-notification-icon"></span> {Utils.getLanguageLabel("Notifications")} <span className="lm-arrow"></span></a></Link>
                </li>
                <hr className="custom-hr2" />
                <li className={router.asPath == "/account/orders" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/orders" }}><a ><span className="lm-icon lm-order-icon"></span> {Utils.getLanguageLabel("My orders")} <span className="lm-arrow"></span></a></Link>
                </li>
                <li className={router.asPath == "/account/wallet" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/wallet" }}><a ><span className="lm-icon lm-wallet-icon"></span> {Utils.getLanguageLabel("My wallet")} <span className="lm-arrow"></span></a></Link>
                </li>
                {/* <li className={router.asPath == "/account/transactions" ? "active" : ""}>
                    <Link passHref href={{ pathname: "/account/transactions" }}><a ><span className="lm-icon lm-transaction-icon"></span> {Utils.getLanguageLabel("My transactions")} <span className="lm-arrow"></span></a></Link>
                </li> */}
                <hr className="custom-hr2" />
                <li>
                    <a onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}><span className="lm-icon lm-signout-icon"></span> {Utils.getLanguageLabel("Sign out")} <span className="lm-arrow"></span></a>
                </li>
                <div className="mt-10 green-text xs-heading fw-500 text-center">{Utils.getLanguageLabel("Version")} 0.0.2</div>
            </ul>

            <ConfirmModal
                title="Are you sure"
                subTitle="You want to logout?"
                showModal={showModal}
                onCancelPress={() => setShowModal(false)}
                onConfirmPress={() => {
                    makeUserLogout()
                }} />
        </>
    )
}