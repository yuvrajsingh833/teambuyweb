import Image from 'next/image'

export default function Footer({ }) {
    return (
        <footer className="footer-wrap">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-logo">
                        <a href="index.html"> <img src="img/footer-logo.png" /> </a>
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            <div className="f-title">Categories</div>
                            <div className="d-flex flex-wrap">
                                <ul className="f-menu w-50">
                                    <li><a href="#">grocery & staples</a></li>
                                    <li><a href="#">vegetables & fruits</a></li>
                                    <li><a href="#">household items</a></li>
                                    <li><a href="#">noodles, sauces & instant food</a></li>
                                    <li><a href="#">bakery & biscuits</a></li>
                                    <li><a href="#">personal care</a></li>
                                    <li><a href="#">cold drinks & juices</a></li>
                                    <li><a href="#">tea, coffee & health drinks</a></li>
                                    <li><a href="#">sweet tooth</a></li>
                                </ul>
                                <ul className="f-menu w-50">
                                    <li><a href="#">munchies</a></li>
                                    <li><a href="#">pharma & baby care</a></li>
                                    <li><a href="#">breakfast & dairy</a></li>
                                    <li><a href="#">eggs, meat & fish</a></li>
                                    <li><a href="#">frozen food</a></li>
                                    <li><a href="#">battery, bulb & accessorie</a></li>
                                    <li><a href="#">cleaning & bathroom essentials</a></li>
                                    <li><a href="#">home furnishing</a></li>
                                    <li><a href="#">kitchen & dining needs</a></li>
                                    <li><a href="#">home appliances</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="f-title">Company</div>
                            <ul className="f-menu">
                                <li><a href="#">Who We Are</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Report Fraud</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <div className="f-title">For Consumers</div>
                            <ul className="f-menu">
                                <li><a href="#">Privacy</a></li>
                                <li><a href="#">Terms</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Security</a></li>
                                <li><a href="#">Mobile</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <div className="f-title">Social Links</div>
                            <div className="social-links">
                                <a href="#"><img src="img/fb.png" /></a>
                                <a href="#"><img src="img/in.png" /></a>
                                <a href="#"><img src="img/insta.png" /></a>
                                <a href="#"><img src="img/tw.png" /></a>
                            </div>
                            <div className="app-link mt-30">
                                <a href="#"><img src="img/app-store.png" /></a>
                                <a href="#" className="ml-20"><img src="img/play-store.png" /></a>
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
                    <div className="fb-content">By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2020-2021 © Teambuy. All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}