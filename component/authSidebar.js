import React, { useEffect, useState } from "react";
import { ActionCreators } from "../store/actions/index";
import Image from 'next/image'
import Loader from './loader'

import * as Validations from "../lib/validation";
import * as Utils from "../lib/utils"

import * as AuthService from "../services/auth";

export default function AuthSideBar(props) {

    const [isLoading, setIsLoading] = useState(false);

    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileNumberError, setMobileNumberError] = useState(null);

    const [OTP, setOTP] = useState('');
    const [OTPError, setOTPError] = useState(null);
    const [userInitData, setUserInitData] = useState('');

    const [seconds, setSeconds] = useState(30);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive && seconds == 0) {
            clearInterval(interval);
            setIsActive(false);
        }

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        }
        return () => {
            clearInterval(interval)
        };
    }, [isActive, seconds]);

    const doOTPVerification = (otp = OTP) => {

        setIsLoading(true)
        fetch('https://geolocation-db.com/json/')
            .then(response => response.json())
            .then(res => {
                let postParams = {
                    "mobileNumber": userInitData.mobileNumber,
                    "userType": 'customer',
                    "otp": otp,
                    "deviceIP": res?.IPv4,
                    "deviceID": 'web',
                    "deviceToken": 'web',
                    "deviceType": 'web',
                    "appVersion": 'web',
                    "userID": userInitData.userId
                }

                AuthService.verifyOTP(postParams).then(verifyOTPResponse => {
                    if (verifyOTPResponse.statusCode != 200) {
                        setIsLoading(false)
                        setOTPError(verifyOTPResponse.message)
                    } else {
                        let userResultData = verifyOTPResponse.data
                        ActionCreators.setLoggedInUserData(userResultData)
                        Utils.saveStateAsyncStorage({ userData: userResultData });
                        setIsLoading(false)
                        window.location.reload()
                    }
                }).catch(e => {
                    setOTPError("Please enter a valid OTP")
                    console.log(`Verify OTP error : ${e}`)
                    setIsLoading(false)
                })
            }).catch(e => {
                setOTPError("Something went wrong. Please try again")
                console.log(`Verify OTP error : ${e}`)
                setIsLoading(false)
            })
    }

    const handleOTPVerification = () => {
        let OTPValidation = Validations.validateField(OTP, { emptyField: 'OTP cannot be blank' })
        let error = {};

        if (OTPValidation.error) {
            error['otp'] = OTPValidation.message
        }

        if (Object.keys(error).length == 0) {
            doOTPVerification()
        } else {
            setOTPError(error.otp)
            return false;
        }
    }

    const doLogin = () => {
        setSeconds(30);
        setOTPError(null)
        setIsActive(true);
        setOTP('')
        setIsLoading(true)

        AuthService.sendOTP({ "mobileNumber": mobileNumber, "userType": 'customer' }).then(response => {
            if (response.statusCode != 200) {
                setIsLoading(false)
                setMobileNumberError(response.message)
            } else {
                setIsLoading(false)
                setSeconds(30)
                setUserInitData(response.data)
                window.openOTPSideBar();
            }
        }).catch(e => {
            setIsLoading(false)
            console.log(`OTP error : ${e}`)
        })
    }

    const handleLogin = () => {
        let mobileNumberValidation = Validations.validateMobile(mobileNumber, {})
        let error = {};

        if (mobileNumberValidation.error) {
            error['mobileNumber'] = mobileNumberValidation.message
        }
        if (Object.keys(error).length == 0) {
            doLogin()
        } else {
            setMobileNumberError(error.mobileNumber)
            return false;
        }
    }

    return (
        <>
            <div className="sidebar-overlay-bg" onClick={() => window.closeSidebar()}></div>

            <section className="sidebar-block" id="loginSidebar">
                <div className="login-img text-right">
                    <Image layout='raw' style={{ objectFit: 'contain' }} height={300} width={300} src="/img/login-img.png" alt="login-image" />
                </div>
                {isLoading ? <Loader /> :
                    <div className="plr-27">
                        <div className="md-heading">Get your groceries <br />with Team Buy</div>
                        <form className="custom-form mt-30">
                            <div className="form-group pos-rel">
                                <input type="text" maxLength={10} className="form-control" placeholder="Enter your mobile number" onChange={(event) => { setMobileNumber(event.target.value) }} value={mobileNumber} />
                                <span className="form-icon phone-icon"></span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#D83734' }}>{mobileNumberError}</span>

                            <div className="text-center mt-4">
                                <button className="green-btn" onClick={() => handleLogin()} type="button">Get OTP</button>
                            </div>
                        </form>
                    </div>
                }
                <div className="xs-heading mt-40 font-12 plr-9">By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. {new Date().getFullYear()}©Teambuy. All rights reserved.</div>
            </section>

            <section className="sidebar-block" id="mobileVerfication">
                <a style={{ cursor: 'pointer' }} className="back-arrow "><Image layout='raw' style={{ objectFit: 'contain' }} height={12} width={12} src="/img/back-arrow.png" alt="back-arrow.png" /></a>
                <div className="login-img text-right">
                    <Image layout='raw' style={{ objectFit: 'contain' }} height={300} width={300} src="/img/login-img.png" alt="login-img.png" />
                </div>
                {isLoading ? <Loader /> :
                    <div className="plr-27">
                        <div className="md-heading">Verify your mobile <br />
                            <span className="green-text">+91 {mobileNumber}</span></div>
                        <form className="custom-form mt-30">
                            <div className="form-group">
                                <input type="text" maxLength={6} className="form-control" placeholder="Enter the OTP" onChange={(event) => { setOTP(event.target.value) }} value={OTP} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#D83734' }}>{OTPError}</span>

                            <div className="text-center mt-4">
                                <button onClick={() => handleOTPVerification()} type="button" className="green-btn">Verify OTP</button>
                            </div>
                        </form>
                        <div className="black-link text-center mt-20">
                            Didn’t receive OTP yet? <a onClick={() => {
                                if (seconds <= 0) {
                                    doLogin()
                                }
                            }} style={{ cursor: 'pointer' }} className="green-text">Resend OTP</a><br />
                            <span style={{ fontSize: '12px', color: '#c7c7c7' }}>00:{('0' + seconds).slice(-2)}</span>
                        </div>
                    </div>}
                <div className="xs-heading mt-40 font-12 plr-9">By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. {new Date().getFullYear()}©Teambuy. All rights reserved.</div>
            </section>
        </>
    )
}