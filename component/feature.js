export default function Feature({ }) {
    return (<section className="featured-wrap">
        <div className="row">
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <img src="/img/offers.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">Big savings with seasonal discounts</div>
                        <div className="xs-content">We belive in providing best competitive prices to all of our customers</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <img src="/img/order-out-for-delivery.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">Same day delivery guaranteed!</div>
                        <div className="xs-content">We dispatch all the orders within two hours of the order being placed</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <img src="/img/wide-range.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">Wide range of products</div>
                        <div className="xs-content">Choose from 1000+ products, curated from different brands</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex align-items-center featured-flex">
                    <div className="featured-icon">
                        <img src="/img/best-price.png" />
                    </div>
                    <div className="featured-content">
                        <div className="xs-heading green-text">Best prices & offers</div>
                        <div className="xs-content">Cheaper price compare to local market, with great discount of team buyig</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}