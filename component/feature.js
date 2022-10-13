import Image from 'next/image';
import * as Utils from "../lib/utils"

export default function Feature({ }) {
    return (<section className="featured-wrap">
        <div className="row">
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/offers.png" alt="offers.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">{Utils.getLanguageLabel("Big savings with seasonal discounts")}</div>
                        <div className="xs-content">{Utils.getLanguageLabel("We believe in providing best competitive prices to all of our customers")}</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/order-out-for-delivery.png" alt="order-out-for-delivery.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">{Utils.getLanguageLabel("Same day delivery guaranteed!")}</div>
                        <div className="xs-content">{Utils.getLanguageLabel("We dispatch all the orders within two hours of the order being placed")}</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/wide-range.png" alt="wide-range.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">{Utils.getLanguageLabel("Wide range of products")}</div>
                        <div className="xs-content">{Utils.getLanguageLabel("Choose from 1000+ products, curated from different brands")}</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} src="/img/best-price.png" alt="best-price.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">{Utils.getLanguageLabel("Best prices & offers")}</div>
                        <div className="xs-content">{Utils.getLanguageLabel("Cheaper price compare to local market, with great discount of team buying")}</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}