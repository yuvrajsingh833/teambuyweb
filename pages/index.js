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
import { Config } from '../config/config';

import PromotionalOffers from "../component/promotionalOffers";
import AuthSideBar from "../component/authSidebar";
import ProductOfferCard from "../component/productOfferCard";

var $ = require("jquery");
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

export default function Home(props) {

  const BASE_URL_TEAM_AVATAR = `${Config.BaseURL.fileServer}${Config.FilePath.teamAvatar}`
  const BASE_URL_CURATED_DEALS = `${Config.BaseURL.fileServer}${Config.FilePath.curatedDeals}`
  const BASE_URL_DEALS_OF_THE_DAY = `${Config.BaseURL.fileServer}${Config.FilePath.dealsOfTheDay}`

  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false)

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

  const openLogin = () => {
    setShowLogin(true);
    setTimeout(() => { window.openLoginSideBar() }, 300)
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

  const renderFeaturedCategoryProducts = (data, keyString = 'product_item_') => {
    if (data)
      return data.map(item => {
        return <div key={`${keyString}${item._id}`}
          className="item">
          <ProductCard item={item} showLogin={(value) => { openLogin() }} />
        </div>
      })
  }

  const renderTeamBuyOfferProducts = (data) => {
    if (data)
      return data.map(item => {
        return <div key={`teambuy_offer_card_${item._id}`}
          className="item">
          <ProductOfferCard item={item} showLogin={(value) => { openLogin() }} />
        </div>
      })
  }

  if (isLoading) return <Loader />

  return (
    <>
      {dashboardData?.promotionalOffers?.length > 0 && <PromotionalOffers bannerData={dashboardData?.promotionalOffers} />}

      {dashboardData?.previousPurchaseItems?.length > 0 && <section className="purchases-wrap">
        <div className="container">
          <div className="d-flex align-items-center heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Your previous purchases")}</div>
            <div className="ml-auto">
              <Link passHref href={{ pathname: '/account/orders' }}>
                <a style={{ cursor: 'pointer' }} className="green-link">{Utils.getLanguageLabel("View All")}</a>
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
            {renderFeaturedCategoryProducts(dashboardData.previousPurchaseItems, 'previous_purchase_')}
          </OwlCarousel>
        </div>
      </section>}

      <section className="category-wrap ptb-30">
        <div className="container">
          <div className="heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Shop by category")}</div>
          </div>
          <div className="catrgory-list mt-10">
            <ul>
              {renderCategory(dashboardData?.category)}
            </ul>
          </div>
        </div>
      </section>

      {dashboardData?.popularProducts?.length > 0 && <section className="purchases-wrap">
        <div className="container">
          <div className="d-flex align-items-center heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Popular products")}</div>
            <div className="ml-auto">
              <Link passHref href={{ pathname: '/account/orders' }}>
                <a style={{ cursor: 'pointer' }} className="green-link">{Utils.getLanguageLabel("View All")}</a>
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
            {renderFeaturedCategoryProducts(dashboardData.popularProducts, 'popular_products_')}
          </OwlCarousel>
        </div>
      </section>}

      {dashboardData?.nearbyTeam?.length > 0 && <section className="nearby-wrap ptb-30">
        <div className="container">
          <div className="d-flex align-items-center heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Teams around you")}</div>
            <div className="ml-auto">
              <Link passHref href={{ pathname: '/team' }}>
                <a style={{ cursor: 'pointer' }} className="green-link">{Utils.getLanguageLabel("View All")}</a>
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
            {dashboardData?.nearbyTeam.map(team => {
              return <Link key={`team_member_${team.id}`} passHref href={{
                pathname: "/team/join-cart/[id]",
                query: { id: team.team_code }
              }} >

                <a className="item d-flex align-items-center nearby-box">
                  <div className="circle-box team-circle">
                    <Image alt={team.team_name} src={BASE_URL_TEAM_AVATAR + team.team_avatar} layout="raw" height={100} width={100} />
                  </div>
                  <div className="xs-heading text-ellipsis">{team.team_name}</div>
                </a>
              </Link>
            })}
          </OwlCarousel>
        </div>
      </section>}

      {dashboardData?.curatedDeals?.length > 0 && <section className="deals-wrap  ptb-30">
        <div className="container">
          <div className="heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Curated deals for you")}</div>
          </div>
          <OwlCarousel
            className="five-items-slider owl-carousel common-navs mt-20"
            loop={false}
            margin={12}
            nav={true}
            dots={false}
            responsiveClass={true}
            responsive={Enums.OwlCarouselSlider.fiveItemSlider}
          >
            {dashboardData.curatedDeals.map(item => {
              return <div key={`crated_deals_${item.id}`} className="item">
                <div className="curated-deal-box">
                  <Image
                    src={BASE_URL_CURATED_DEALS + item.banner}
                    alt={item?.heading}
                    layout="raw"
                    height={200 * 2}
                    width={254 * 2}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            })}
          </OwlCarousel>
        </div>
      </section>}

      {featuredCategories?.map(featuredCategory => {
        if (featuredCategory.products.length > 0) {
          return (
            <section key={`${featuredCategory.heading}_${featuredCategory.categoryID}`} className="everyday-usage-wrap ptb-30">
              <div className="container">
                <div className="d-flex align-items-center heading-flex">
                  <div className="sm-heading">{Utils.getLanguageLabel(featuredCategory.heading)}</div>
                  <div className="ml-auto">
                    <Link
                      passHref
                      href={{
                        pathname: '/category/[id]/[name]',
                        query: { id: featuredCategory.categoryID, name: Utils.convertToSlug(featuredCategory.heading) },
                      }}
                    >
                      <a style={{ cursor: 'pointer' }} className="green-link">{Utils.getLanguageLabel("View All")}</a>
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

      {dashboardData?.teambuyOffers?.length > 0 && <section className="teambuy-offer-wrap ptb-30">
        <div className="container">
          <div className="d-flex align-items-center heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Teambuy offers")}</div>
          </div>

          <OwlCarousel
            className="teambuy-offer-slider owl-carousel common-navs mt-20"
            loop={false}
            margin={12}
            nav={true}
            dots={false}
            responsiveClass={true}
            responsive={Enums.OwlCarouselSlider.offerSlider}
          >
            {renderTeamBuyOfferProducts(dashboardData.teambuyOffers)}
          </OwlCarousel>
        </div>
      </section>}


      {dashboardData?.dealsOfTheDay?.length > 0 && <section className="deal-the-day-wrap">
        <div className="container">
          <div className="d-flex align-items-center heading-flex">
            <div className="sm-heading">{Utils.getLanguageLabel("Deals of the day")}</div>
          </div>
          <OwlCarousel
            className="five-items-slider owl-carousel common-navs mt-20"
            loop={false}
            margin={12}
            nav={true}
            dots={false}
            responsiveClass={true}
            responsive={Enums.OwlCarouselSlider.EightItemSlider}
          >
            {dashboardData.dealsOfTheDay.map(item => {
              return <div key={`crated_deals_${item.id}`} className="item">
                <div className="deal-of-the-day-box">
                  <Image
                    src={BASE_URL_DEALS_OF_THE_DAY + item.banner}
                    alt={item?.heading}
                    layout="raw"
                    height={180 * 2}
                    width={150 * 2}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            })}
          </OwlCarousel>
        </div>
      </section>}

      <section className="teambuy-app-wrap">
        <div className="container">
          <div className="teambuy-app-block">
            <div className="ta-block1-flex row align-items-center">
              <div className="col-md-5">
                <div className="ta-heading">{Utils.getLanguageLabel("TeamBuy")}</div>
                <div className="ta-subheading">{Utils.getLanguageLabel("Buy in a group and avail never seen before discounts on groceries and home essentials")}</div>
                <div className="ta-subheading2">{Utils.getLanguageLabel("Teambuy is a Hyperlocal on demand social commerce platform for Grocery and home essentials delivery.Teambuy is making E-commerce more social, pocket friendly, fun, interactive and quick, one  customer at a time")}</div>
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
                <div className="tab1-heading">{Utils.getLanguageLabel("Get the app now")}</div>
                <div className="tab1-subheading mt-10">{Utils.getLanguageLabel("we will send you a link, open it on your phone to download the app")}</div>
                <div className="mt-10">
                  <div className="custom-radio d-inline-block">
                    <input type="radio" id="emailApp" name="radio-group" />
                    <label htmlFor="emailApp">{Utils.getLanguageLabel("Email")}</label>
                  </div>
                  <div className="custom-radio d-inline-block ml-20">
                    <input type="radio" id="phoneApp" name="radio-group" />
                    <label htmlFor="phoneApp">{Utils.getLanguageLabel("Phone")}</label>
                  </div>
                </div>
                <form className="app-link-form mt-10">
                  <div className="row">
                    <div className="col-md-7">
                      <input type="text" className="form-control" placeholder="Enter your email address" />
                    </div>
                    <div className="col-md-5">
                      <button className="green-btn">{Utils.getLanguageLabel("Send Now")}</button>
                    </div>
                  </div>
                </form>
                <div className="tab1-subheading mt-20">{Utils.getLanguageLabel("Or download the app from")}</div>
                <div className="app-link mt-20">
                  <Link passHref href="https://apps.apple.com/us/app/teambuy/id1616147376"><a target={"_blank"} ><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={137} alt="app-store-icon" src="/img/app-store.png" /></a></Link>
                  <Link passHref href="https://play.google.com/store/apps/details?id=com.teambuy.android"><a target={"_blank"} className="ml-20"><Image layout='raw' style={{ objectFit: 'contain' }} height={40} width={137} alt="app-store-icon" src="/img/play-store.png" /></a></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showLogin && <AuthSideBar />}
      <Feature />
    </>
  )
}