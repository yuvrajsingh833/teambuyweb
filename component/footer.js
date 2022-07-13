import Image from 'next/image'
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import * as CategoryService from "../services/category";
import Link from 'next/link'

import * as Utils from "../lib/utils"

export default function Footer(props) {
    const [categories, setCategories] = useState([])

    const getAllCategories = () => {
        CategoryService.allCategory().then(response => {
            setCategories(response.data)
        }).catch(e => {
            console.log(`getAllCategories error : ${e}`)
        })
    }

    useEffect(() => {
        getAllCategories()
    }, [props]);

    return (
        <footer className="footer-wrap">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-logo">
                        <Link passHref href="/"><a><Image layout='raw' style={{ objectFit: 'contain' }} height={100} width={313} alt="footer-logo" src="/img/footer-logo.png" /> </a></Link>
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="f-title">Categories</div>
                            <div className="d-flex flex-wrap">
                                <ul className="f-menu w-50">
                                    {categories.slice(0, (categories.length / 2)).map(mapItem => {
                                        return <li key={`footer_category_${mapItem.id}`}>
                                            <Link
                                                passHref
                                                href={{
                                                    pathname: '/category/[id]/[name]',
                                                    query: { id: mapItem.id, name: Utils.convertToSlug(mapItem.name) },
                                                }}
                                            >
                                                <a >{mapItem.name}</a>
                                            </Link>
                                        </li>
                                    })}
                                </ul>

                                <ul className="f-menu w-50">
                                    {categories.slice((categories.length / 2), categories.length - 1).map(mapItem => {
                                        return <li key={`footer_category_${mapItem.id}`}>
                                            <Link
                                                passHref
                                                href={{
                                                    pathname: '/category/[id]/[name]',
                                                    query: { id: mapItem.id, name: Utils.convertToSlug(mapItem.name) },
                                                }}
                                            >
                                                <a >{mapItem.name}</a>
                                            </Link>
                                        </li>
                                    })}

                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="f-title">Company</div>
                            <ul className="f-menu">
                                <li><a >Who We Are</a></li>
                                <li><a >Blog</a></li>
                                <li>
                                    <Link passHref href={{ pathname: "/pages/career" }}>
                                        <a className="black-text font-poppins">Careers</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link passHref href={{ pathname: "/pages/contact-us" }}>
                                        <a className="black-text font-poppins">Report Fraud</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link passHref href={{ pathname: "/pages/contact-us" }}>
                                        <a className="black-text font-poppins">Contact</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <div className="f-title">For Consumers</div>
                            <ul className="f-menu">
                                <li><Link passHref href="/pages/privacy-policy"><a >Privacy</a></Link></li>
                                <li><Link passHref href="/pages/terms-and-conditions"><a >Terms</a></Link></li>
                                <li>
                                    <Link passHref href={{ pathname: "/pages/faqs" }}>
                                        <a className="black-text font-poppins">FAQs</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link passHref href={{ pathname: "/pages/security" }}>
                                        <a className="black-text font-poppins">Security</a>
                                    </Link>
                                </li>
                                <li><a >Mobile</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <div className="f-title">Social Links</div>
                            <div className="social-links">
                                <a ><Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/fb.png" alt='social-icons' /></a>
                                <a ><Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/in.png" alt='social-icons' /></a>
                                <a ><Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/insta.png" alt='social-icons' /></a>
                                <a ><Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/tw.png" alt='social-icons' /></a>
                            </div>
                            <div className="app-link mt-30">
                                <Link passHref href="https://apps.apple.com/us/app/teambuy/id1616147376"><a target={"_blank"} ><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={137} alt="app-store-icon" src="/img/app-store.png" /></a></Link>
                                <Link passHref href="https://play.google.com/store/apps/details?id=com.teambuy.android"><a target={"_blank"} className="ml-20"><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={137} alt="app-store-icon" src="/img/play-store.png" /></a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="fb-title">Brands available on teambuy</div>
                    <div className="fb-content mt-20">Mother's Choice g Fresh O'range Savemore 24 Mantra Aashirvaad Act II Amul Axe Bambino Best Value Bingo Bisleri Boost Bournvita Britannia Brooke Bond Bru Cadbury Cheetos Cinthol Closeup Coca-Cola Colgate Dabur Danone Del Monte Dettol Dhara Dove Durex English Oven Everest Fiama Di Wills Garnier Gatorade Gillette Glucon-D Grocery Gowardhan Hajmola Haldiram's Head & Shoulders Heinz Himalaya Horlicks India Gate Kellogg's Kinley Kissan Knorr L'Oreal Lay's Lijjat Limca Lipton Maggi Madhur McCain MDH Minute Maid Mirinda Mother Dairy Mountain Dew MTR Nescafe Nestle Nivea Nutella Oral-B Oreo Palmolive Pantene Paper Boat Parachute Parle Patanjali Pears Pepsi Pepsodent Pillsbury Princeware Rajdhani Real Red Bull Safal Saffola Shakti Bhog Smith & Jones Sprite Stayfree Sundrop Sunfeast Sunsilk Taj Mahal Tang Tata sampann Tata tea Tetley Thums Up Tropicana Twinings Uncle Chipps Unibic Vaseline Veet Wagh Bakri Wai Wai Whisper Whole Farm </div>
                    <hr className="custom-hr" />
                    <div className="fb-content">By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. {new Date().getFullYear()}©Teambuy. All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}