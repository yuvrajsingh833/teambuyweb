import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from "react";

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';

import * as PaymentService from "../../../services/payment";

import * as Dates from "../../../lib/dateFormatService";

import AccountSideBar from "../../../component/accountSidebar";
import LoaderInline from '../../../component/loaderInline';
import { Config } from '../../../config/appConfig';

export default function MyTransactions() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [allTransactions, setTransactions] = useState([]);
    const [currentPageNo, setCurrentPageNo] = useState(1)
    const [transactionInfo, setTransactionInfo] = useState({})


    const getAllTransactions = (page = currentPageNo, loading = true) => {
        setIsLoading(loading)
        PaymentService.allPaymentTransactions({ limit: Config.PageSize, page: page }).then(response => {
            let dataItems = response.data.items

            if (page == 1) {
                setCurrentPageNo(1);
                setTransactions(dataItems)
            } else {
                setTransactions(newDataList => ([...newDataList, ...dataItems]))
            }

            setTransactionInfo(response.data.paginator)

            setIsLoading(false)
            setIsLoadingMore(false)
        }).catch(e => {
            setIsLoading(false)
            setIsLoadingMore(false)
            console.log(`allPaymentTransactions error : ${e}`)
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
    }, [])

    useEffect(() => {
        if (!isLoadingMore) return;
        getMoreTransactions();
    }, [isLoadingMore]);

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>My Transactions | Teambuy</title>
                <meta name="description" content="My Transactions | Teambuy" />
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
                            <li className="breadcrumb-item active" aria-current="page">My Wallet</li>
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
                            <div className="white-box transaction-block">

                                <div className="row wallet-history">
                                    {allTransactions.map(item => {
                                        let amountIn = true;
                                        if (item.end_balance > item.start_balance) {
                                            amountIn = true;
                                        } else {
                                            amountIn = false;
                                        }

                                        return <div key={`transaction_${item.id}`} className="col-lg-6 col-12 mb-20">
                                            <div className="white-box wh-box d-flex align-items-center">
                                                <div className="wh-icon">
                                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={45} width={45} alt="card" src="/img/card.svg" />
                                                </div>
                                                <div className="wh-info">
                                                    <div className="xs-heading fw-500">Order #{item.order_txn_id}</div>
                                                    <div className="xs-heading font-12 gray-text">{Dates.localDate(item.created_at)}</div>
                                                </div>
                                                <div className="wh-coin ml-auto">
                                                    ₹{Number(item.amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}
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