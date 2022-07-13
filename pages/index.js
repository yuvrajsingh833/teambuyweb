import dynamic from "next/dynamic";
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from "react";

import CategoryCard from "../component/categoryCard";
import Feature from '../component/feature';
import Loader from '../component/loader';
import ProductCard from "../component/productCard";

import * as MasterService from "../services/master";

import * as Enums from '../lib/enums';
import * as Utils from "../lib/utils";

import PromotionalOffers from "../component/promotionalOffers";

var $ = require("jquery");
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

export default function Home(props) {

  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState([])
  const [featuredCategories, setFeaturedCategories] = useState([])

  const getDashboard = () => {
    MasterService.dashboard({ userType: 'customer' }).then(response => {
      let allFeatureCategory = JSON.parse(JSON.stringify(response.data.featuredCategories))
      allFeatureCategory.sort((a, b) => b.categoryID - a.categoryID);

      setFeaturedCategories(allFeatureCategory)
      setDashboardData(response.data)
      setIsLoading(false)
    }).catch(e => {
      console.log(`getDashboard error : ${e}`)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    getDashboard()

  }, [props]);

  const renderCategory = (data) => {
    if (data)
      return data.map((item, index) => {
        return (
          <li key={`category_block_item_${index}`}>
            <CategoryCard item={item} />
          </li>
        )
      })
  }

  const renderFeaturedCategoryProducts = (data) => {
    if (data)
      return data.map(item => {
        return <div key={`product_item_${item._id}`}
          className="item">
          <ProductCard item={item} />
        </div>
      })
  }

  if (isLoading) return <Loader />

  return (
    <>
      {dashboardData?.promotionalOffers?.length > 0 && <PromotionalOffers bannerData={dashboardData?.promotionalOffers} />}

      <section className="category-wrap ptb-30">
        <div className="container">
          <div className="heading-flex">
            <div className="sm-heading">Shop by category</div>
          </div>
          <div className="catrgory-list mt-10">
            <ul>
              {renderCategory(dashboardData?.category)}
            </ul>
          </div>
        </div>
      </section>

      {featuredCategories?.map(featuredCategory => {
        if (featuredCategory.products.length > 0) {
          return (
            <section key={`${featuredCategory.heading}_${featuredCategory.categoryID}`} className="everyday-usage-wrap ptb-30">
              <div className="container">
                <div className="d-flex align-items-center heading-flex">
                  <div className="sm-heading">{featuredCategory.heading}</div>
                  <div className="ml-auto">
                    <Link
                      passHref
                      href={{
                        pathname: '/category/[id]/[name]',
                        query: { id: featuredCategory.categoryID, name: Utils.convertToSlug(featuredCategory.heading) },
                      }}
                    >
                      <a className="green-link">View All</a>
                    </Link>
                  </div>
                </div>
                <OwlCarousel
                  className="seven-items-slider owl-carousel common-navs mt-20"
                  loop={false}
                  margin={12}
                  nav={true}
                  dots={false}
                  responsiveClass={true}
                  responsive={Enums.OwlCarouselSlider.sevenItemSlider}
                >
                  {renderFeaturedCategoryProducts(featuredCategory.products)}
                </OwlCarousel>
              </div>
            </section>)
        }
      })}

      <section className="teambuy-app-wrap">
        <div className="container">
          <div className="teambuy-app-block">
            <div className="ta-block1-flex row align-items-center">
              <div className="col-md-5">
                <div className="ta-heading">TeamBuy</div>
                <div className="ta-subheading">Buy in a group and avail never seen before discounts on groceries and home essentials</div>
                <div className="ta-subheading2">Teambuy is a Hyperlocal on demand social commerce platform for Grocery and home essentials delivery.Teambuy is making E-commerce more social, pocket friendly, fun, interactive and quick, one  customer at a time</div>
              </div>
              <div className="col-md-7 text-right">
                <img src="/img/ta-block-img1.png" alt="delivery-icon" />
              </div>
            </div>
            <div className="ta-block2-flex row align-items-center">
              <div className="col-md-5">
                <img src="/img/app-screens-img.png" alt="feature screen" />
              </div>
              <div className="col-md-7">
                <div className="tab1-heading">Get the app now</div>
                <div className="tab1-subheading mt-10">we will send you a link, open it on your phone to download the app</div>
                <div className="mt-10">
                  <div className="custom-radio d-inline-block">
                    <input type="radio" id="emailApp" name="radio-group" />
                    <label htmlFor="emailApp">Email</label>
                  </div>
                  <div className="custom-radio d-inline-block ml-20">
                    <input type="radio" id="phoneApp" name="radio-group" />
                    <label htmlFor="phoneApp">Phone</label>
                  </div>
                </div>
                <form className="app-link-form mt-10">
                  <div className="row">
                    <div className="col-md-7">
                      <input type="text" className="form-control" placeholder="Enter your email address" />
                    </div>
                    <div className="col-md-5">
                      <button className="green-btn">Send Now</button>
                    </div>
                  </div>
                </form>
                <div className="tab1-subheading mt-20">Or download the app from</div>
                <div className="app-link mt-20">
                  <Link passHref href="https://apps.apple.com/us/app/teambuy/id1616147376"><a target={"_blank"} ><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={137} alt="app-store-icon" src="/img/app-store.png" /></a></Link>
                  <Link passHref href="https://play.google.com/store/apps/details?id=com.teambuy.android"><a target={"_blank"} className="ml-20"><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={137} alt="app-store-icon" src="/img/play-store.png" /></a></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Feature />
    </>
  )
}