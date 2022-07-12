import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import React, { useEffect, useState } from "react";
import { useSnackbar } from 'react-simple-snackbar';
import { ActionCreators } from "../../store/actions/index";

import Feature from '../../component/feature';
import Loader from '../../component/loader';

import * as UserService from "../../services/user";

import * as Utils from "../../lib/utils";
import * as Validations from "../../lib/validation";

import AccountSideBar from "../../component/accountSidebar";
import { Config } from '../../config/appConfig';

export default function MyAccount(props) {
    const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.userAvatar}`

    const [openSnackbar] = useSnackbar()

    const [isLoading, setIsLoading] = useState(true);

    const [name, setName] = useState(null);
    const [mobileNumber, setMobileNumber] = useState(null);
    const [email, setEmail] = useState(null);

    const [nameError, setNameError] = useState(null);
    const [mobileNumberError, setMobileNumberError] = useState(null);
    const [emailError, setEmailError] = useState(null);

    const [userInformation, setUserInformation] = useState({});

    const getUserInfo = (updateUserInfo = false) => {
        setIsLoading(true)
        UserService.getUserDetail().then(response => {
            if (response.statusCode != 200) {
                setIsLoading(false)
            } else {
                if (updateUserInfo) {
                    let oldUserData = JSON.parse(JSON.stringify(global.user));
                    let newUserData = JSON.parse(JSON.stringify(response.data));

                    oldUserData['name'] = newUserData.name
                    oldUserData['email'] = newUserData.email
                    oldUserData['mobileNumber'] = newUserData.mobile_number
                    oldUserData['avatar'] = newUserData.avatar

                    global.user = oldUserData;
                    Utils.saveStateAsyncStorage({ userData: oldUserData });
                    ActionCreators.setLoggedInUserData(oldUserData)
                }

                setUserInformation(response.data)
                setName(response.data.name)
                setMobileNumber(response.data.mobile_number)
                setEmail(response.data.email)
                setIsLoading(false)
            }
        }).catch(e => {
            setIsLoading(false)
            console.log(`getUserDetail error : ${e}`)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getUserInfo()
    }, [props]);

    const doProfileUpdate = () => {
        setIsLoading(true)
        let postParams = {
            "name": name,
            "mobileNumber": mobileNumber,
            "email": email,
        }
        UserService.updateUserProfileInfo(postParams).then(response => {
            if (response.statusCode != 200) {
                setIsLoading(false)
                openSnackbar(response.message)
            } else {
                openSnackbar("Profile updated successfully", 1000)
                getUserInfo(true)
            }
        }).catch(e => {
            setIsLoading(false)
            console.log(`updateUserProfileInfo error : ${e}`)
        })
    }

    const handleUpdateProfile = () => {
        let mobileNumberValidation = Validations.validateMobile(mobileNumber, {})
        let emailValidation = Validations.validateEmail(email, {})
        let nameValidation = Validations.validateAlphaString(name, { emptyField: 'Name cannot be empty', validFiled: 'Please enter a valid name' })
        let error = {};

        if (mobileNumberValidation.error) {
            error['mobileNumber'] = mobileNumberValidation.message
        }
        if (emailValidation.error) {
            error['email'] = emailValidation.message
        }
        if (nameValidation.error) {
            error['name'] = nameValidation.message
        }
        if (Object.keys(error).length == 0) {
            doProfileUpdate()
        } else {
            setMobileNumberError(error.mobileNumber)
            setEmailError(error.email)
            setNameError(error.name)
            return false;
        }
    }

    const updateUserAvatar = event => {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            const imageData = new FormData();
            imageData.append("userAvatar", image);

            setIsLoading(true)
            UserService.updateUserAvatar(imageData).then(response => {
                if (response.statusCode != 200) {
                    setIsLoading(false)
                    openSnackbar(response.message)
                } else {
                    openSnackbar("Profile image updated successfully", 1000)
                    getUserInfo(true)
                }
            }).catch(e => {
                setIsLoading(false)
                console.log(`updateUserProfileInfo error : ${e}`)
            })
        }
    };

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Update Account | Teambuy</title>
                <meta name="description" content="Update Account | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/" }}>
                                    <a>Home</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a >My account</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Update Profile</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="common-wrap ptb-40">
                <div className="container">
                    <div className="common-flex d-flex">
                        <div className="common-left">
                            <a style={{ cursor: 'pointer' }} onClick={() => window.openUserSideBar()} className="mob-profile-menu"></a>
                            <div className="lm-overflow-bg" onClick={() => window.closeUserSideBar()}></div>
                            <div className="left-menu-box">
                                <AccountSideBar />
                            </div>
                        </div>

                        <div className="common-right">
                            <div className="white-box pd-15">
                                <div className="d-inline-flex align-items-center user-info-flex pl-10">
                                    <div className="user-img">
                                        <Image
                                            alt={BASE_URL + global.user.avatar}
                                            height={100}
                                            width={100}
                                            layout="raw"
                                            src={BASE_URL + global.user.avatar} />
                                        <div className="upload-icon">
                                            <input onChange={updateUserAvatar} type="file" accept="image/*" />
                                        </div>
                                    </div>
                                    <div className="user-info">
                                        <div className="xs-heading font-15">{global.user.name}</div>
                                        <div className="xs-heading gray-text">+91 {global.user.mobileNumber}</div>
                                    </div>
                                </div>
                                <form className="custom-form mt-60">
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-6  pb-4">
                                            <div className="form-group pos-rel">
                                                <input onChange={(event) => { setName(event.target.value) }} type="text" className="form-control" value={name} />
                                                <span className="form-icon user-icon"></span>
                                            </div>
                                            <span style={{ fontSize: '12px', color: '#D83734' }}>{nameError}</span>
                                        </div>
                                        <div className="col-lg-4 col-sm-6  pb-4">
                                            <div className="form-group pos-rel">
                                                <input onChange={(event) => { setMobileNumber(event.target.value) }} type="text" className="form-control" placeholder="Enter your mobile number" value={mobileNumber} />
                                                <span className="form-icon phone-icon"></span>
                                            </div>
                                            <span style={{ fontSize: '12px', color: '#D83734' }}>{mobileNumberError}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-6  pb-4">
                                            <div className="form-group pos-rel">
                                                <input onChange={(event) => { setEmail(event.target.value) }} type="text" className="form-control" value={email} />
                                                <span className="form-icon email-icon"></span>
                                            </div>
                                            <span style={{ fontSize: '12px', color: '#D83734' }}>{emailError}</span>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <button onClick={() => { handleUpdateProfile() }} type="button" className="green-btn">UPDATE profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Feature />
        </>
    )
}