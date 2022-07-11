import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from "next/dynamic";
import Script from 'next/script'

import Loader from '../../../component/loader'

export default function ContactUs(props) {

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
                <title>Contact Us | Teambuy</title>
                <meta name="description" content="Contact Us | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

        </>
    )
}
