import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from "next/dynamic";
import Script from 'next/script'

import Loader from '../../../component/loader'

export default function FAQs(props) {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 300)
    }, [props])

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>FAQs | Teambuy</title>
                <meta name="description" content="FAQs | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

        </>
    )
}
