import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Link from 'next/link'


import ProductCard from "../component/productCard";
import CategoryCard from "../component/categoryCard";
import Loader from '../component/loader'

import * as MasterService from "../services/master";

import * as Enums from '../lib/enums'
import * as Utils from "../lib/utils"

import { Config } from '../config/appConfig';

var $ = require("jquery");
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

export default function Home(props) {

  const [isLoading, setIsLoading] = useState(true);


  const [shortAddress, setShortAddress] = useState(null)
  const [fullAddress, setFullAddress] = useState(null)

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
    </>
  )
}