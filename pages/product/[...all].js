import dynamic from "next/dynamic";
import Head from 'next/head';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Config } from '../../config/appConfig';
import * as Utils from '../../lib/utils';
import * as Enums from '../../lib/enums';
import * as CategoryService from "../../services/category";
import * as ProductService from "../../services/product";
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../component/loader';
import { ProductCardBusiness } from "../../component/productCard";
import Feature from '../../component/feature';
var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function ProductDetail(props) {
    const router = useRouter();
    // const { id, name } = router.query;


    useEffect(() => {
        console.log("router.query", router.query)
    }, [props])
    return (

        <Head>
            <title>Buy  | Teambuy</title>
        </Head>
    )
}