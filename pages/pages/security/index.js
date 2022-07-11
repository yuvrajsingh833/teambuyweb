import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from "next/dynamic";
import Script from 'next/script'

import Loader from '../../../component/loader'

export default function Security(props) {

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
                <title>Security | Teambuy</title>
                <meta name="description" content="Security | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

        </>
    )
}
