import React, { useEffect } from "react";

export default function AuthSideBar(props) {

    useEffect(() => {
    }, [props]);

    return (
        <>
            <div className="sidebar-overlay-bg"></div>

            <section className="sidebar-block" id="loginSidebar">
                <div className="login-img text-right">
                    <img src="/img/login-img.png" />
                </div>
                <div className="plr-27">
                    <div className="md-heading">Get your groceries <br />with Team Buy</div>
                    <form className="custom-form mt-30">
                        <div className="form-group pos-rel mb-4">
                            <input type="text" className="form-control" placeholder="Enter your mobile number" />
                            <span className="form-icon phone-icon"></span>
                        </div>
                        <div className="text-center">
                            <button className="green-btn jq_verify" type="button">Get OTP</button>
                        </div>
                    </form>
                    <div className="d-flex align-items-center mt-40">
                        <div className="ml-auto">
                            <a href="#" className="black-link text-uppercase">SKIP LOGIN</a>
                        </div>
                    </div>
                </div>
                <div className="xs-heading mt-40 font-12 plr-9">By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2020-2021 © Teambuy. All rights reserved.</div>
            </section>


            <section className="sidebar-block" id="mobileVerfication">
                <a href="" className="back-arrow"><img src="/img/back-arrow.png" /></a>
                <div className="login-img text-right">
                    <img src="/img/login-img.png" />
                </div>
                <div className="plr-27">
                    <div className="md-heading">Verify your mobile <br />
                        <span className="green-text">+91 9024324365</span></div>
                    <form className="custom-form mt-30">
                        <div className="form-group mb-4">
                            <input type="text" className="form-control" placeholder="Enter your mobile number" />
                        </div>
                        <div className="text-center">
                            <button className="green-btn">Verify OTP</button>
                        </div>
                    </form>
                    <div className="black-link text-center mt-20">
                        Didn’t recieve OTP yet? <a href="#" className="green-text">Resend OTP</a>
                    </div>
                </div>
                <div className="xs-heading mt-40 font-12 plr-9">By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2020-2021 © Teambuy. All rights reserved.</div>
            </section>
        </>
    )
}