import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';
import * as Utils from "../../../lib/utils";

import * as PaymentService from "../../../services/payment";

import NoDataFound from "../../../component/nodataFound";
import * as Dates from "../../../lib/dateFormatService";

import AccountSideBar from "../../../component/accountSidebar";
import LoaderInline from '../../../component/loaderInline';
import { Config } from '../../../config/config';

export default function MyWallet(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [allTransactions, setTransactions] = useState([]);
    const [walletInfo, setWalletInfo] = useState({})
    const [currentPageNo, setCurrentPageNo] = useState(1)
    const [transactionInfo, setTransactionInfo] = useState({})

    const getAllTransactions = (page = currentPageNo, loading = true) => {
        setIsLoading(loading)
        PaymentService.allWalletTransactions({ limit: Config.PageSize, page: page }).then(response => {
            let dataItems = response.data.transactions.items

            if (page == 1) {
                setCurrentPageNo(1);
                setTransactions(dataItems)
            } else {
                setTransactions(newDataList => ([...newDataList, ...dataItems]))
            }

            setWalletInfo(response.data.information)
            setTransactionInfo(response.data.transactions.paginator)

            setIsLoading(false)
            setIsLoadingMore(false)
        }).catch(e => {
            setIsLoading(false)
            setIsLoadingMore(false)
            console.log(`allWalletTransactions error : ${e}`)
        })
    }

    const getMoreTransactions = () => {
        if (transactionInfo.hasNextPage) {
            let newPageNo = currentPageNo + 1;
            setCurrentPageNo(newPageNo)
            getAllTransactions(newPageNo, false)
            setIsLoadingMore(true)
        } else {
            setIsLoadingMore(false)
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight || isLoadingMore) return;
        setIsLoadingMore(true)
    };

    useEffect(() => {
        setIsLoading(true)
        getAllTransactions();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [props])

    useEffect(() => {
        if (!isLoadingMore) return;
        getMoreTransactions();
    }, [isLoadingMore]);

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>My Wallet | Teambuy</title>
                <meta name="description" content="My Wallet | Teambuy" />
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
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("My Wallet")}</li>
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
                            <div className="white-box wallet-block">
                                <div className="d-inline-flex align-items-end wallet-price-flex">
                                    <div className="wallet-total">₹{walletInfo?.amount || 0}</div>
                                    <div className="wallet-vaild-date">{Utils.getLanguageLabel("Available amount in wallet as on")} {Dates.localDate(walletInfo?.created_at || Dates.getUTCTimestamp(new Date()))}</div>
                                </div>

                                <div className="row wallet-history">
                                    {allTransactions.length < 1 &&
                                        <NoDataFound
                                            image="/bgicon/payment.png"
                                            title="No transactions"
                                            subtitle="There were no transactions happened till now."
                                        />}
                                    {allTransactions.map(item => {
                                        let amountIn = true;
                                        if (item.end_balance > item.start_balance) {
                                            amountIn = true;
                                        } else {
                                            amountIn = false;
                                        }

                                        return <div key={`wallet_transaction_${item.id}`} className="col-lg-6 col-12 mb-20">
                                            <div className="white-box wh-box d-flex align-items-center">
                                                <div className="wh-icon">
                                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={45} width={45} alt="credit-debit" src={amountIn ? '/img/credit.svg' : '/img/debit.svg'} />
                                                </div>
                                                <div className="wh-info">
                                                    <div className="xs-heading fw-500">{item.description}</div>
                                                    <div className="xs-heading font-12 gray-text">{Dates.localDate(item.created_at)}</div>
                                                </div>
                                                <div className={`wh-coin ml-auto ${amountIn ? 'green-text' : 'red-text'}`}>
                                                    {amountIn ? '+' : '-'}₹{item.amount}
                                                </div>
                                            </div>
                                        </div>
                                    })}

                                </div>

                            </div>
                            {isLoadingMore && <div className="white-box d-flex pd-20 mb-20"> <LoaderInline /></div>}
                        </div>
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )
}