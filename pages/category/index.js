import dynamic from "next/dynamic";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from "react";

import Loader from '../../component/loader'

import { Config } from '../../config/config';

import * as Utils from '../../lib/utils';
import * as CategoryService from "../../services/category";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function Category(props) {

    const [isLoading, setIsLoading] = useState(true);

    const [allCategories, setAllCategories] = useState([])

    const getAllCategory = () => {
        CategoryService.allCategory().then(response => {
            setAllCategories(response.data)
            setIsLoading(false)
        }).catch(e => {
            console.log(`getAllCategory error : ${e}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getAllCategory()
    }, [props])

    const renderCategory = (data) => {
        const BASE_URL = `${Config.BaseURL.fileServer}${Config.FilePath.categoryIcon}`
        if (data)
            return data.map((item, index) => {
                let subCategory = item.subCategory
                let subCategoryItems = []
                subCategory.slice(0, 5).map(subCategoryItem => {
                    subCategoryItems.push(subCategoryItem.name)
                })
                return (
                    <Link
                        passHref
                        key={`category_block_item_${index}`}
                        href={{
                            pathname: '/category/[id]/[name]',
                            query: { id: item.id, name: Utils.convertToSlug(item.name) },
                        }}
                    >

                        <a className="col-lg-4 col-sm-6">
                            <div className="cat-box cat-green d-flex align-items-center" style={{ backgroundColor: item.bg_color_light, borderColor: item.bg_color_dark }}>
                                <div className="category-img">
                                    <Image
                                        src={BASE_URL + item.icon}
                                        alt={item.name}
                                        height={200}
                                        width={200}

                                        style={{ objectFit: 'contain' }}
                                        layout="raw" className={'category-image'}
                                    />
                                </div>
                                <div className="category-info" style={{ backgroundColor: item.bg_color_dark, borderColor: item.bg_color_dark }}>
                                    <div className="xs-heading fw-500">{item.name}</div>
                                    <div className="xs-heading font-12 mt-10">{Utils.truncateString(subCategoryItems.join(", "), 100)}</div>
                                </div>
                            </div>
                        </a>
                    </Link>
                )
            })
    }

    return (
        <>
            <Head>
                <title>Shop by category | Teambuy</title>
            </Head>
            <section className="category-wrap">
                <div className="container">
                    <div className="row category-list">
                        {renderCategory(allCategories)}
                    </div>
                </div>
            </section>
        </>
    )
}