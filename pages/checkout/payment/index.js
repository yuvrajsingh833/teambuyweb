import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';

import Loader from '../../../component/loader';
import Base64 from '../../../lib/base64';

export default function CheckoutPayment(props) {
    const formRef = useRef(null)
    const router = useRouter();
    const { pd } = router.query;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
            setTimeout(() => {
                formRef.current.submit();
            }, 500)
        }, 500)
    }, [props])

    if (isLoading) return <Loader />
    const paymentData = JSON.parse(Base64.atob(pd));

    return (
        <>
            <Head>
                <title>Payment | Teambuy</title>
                <meta name="description" content="Payment | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form
                ref={formRef}
                action={paymentData.purl}
                method="Post"
                id='payment-form'
                name='payment-form'
            >
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="udf5" name="udf5" value="" />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="surl" name="surl" value={paymentData.surl + "?txnid=" + paymentData.txnID + "&mode=online"} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="furl" name="furl" value={paymentData.furl + "?txnid=" + paymentData.txnID + "&mode=online"} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="curl" name="curl" value={paymentData.furl + "?txnid=" + paymentData.txnID + "&mode=online"} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="key" name="key" value={paymentData.key} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="txnid" name="txnid" placeholder="Transaction ID" value={paymentData.txnID} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="amount" name="amount" placeholder="Amount" value={paymentData.amount} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="productinfo" name="productinfo" placeholder="Product Info" value={paymentData.productInfo} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="firstname" name="firstname" placeholder="First Name" value={paymentData.firstName} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="email" name="email" placeholder="Email ID" value={paymentData.email} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="phone" name="phone" placeholder="Mobile/Cell Number" value={paymentData.phone} />
                <input type="hidden" onChange={(event) => console.log(event.target.value)} id="hash" name="hash" placeholder="Hash" value={paymentData.hash} />
            </form>
            <Script id="payment-footer-scripts" strategy="lazyOnload">
                {`
                    window.onload = function(){
                        alert()
                        document.forms['payment-form'].submit();
                    }
                `}
            </Script>
        </>
    )
}
