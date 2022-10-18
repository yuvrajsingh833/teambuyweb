import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script'
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

import Feature from '../../../component/feature';
import Loader from '../../../component/loader';
import AccountSideBar from "../../../component/accountSidebar";
import { ConfirmModal } from '../../../component/modal'

import * as Utils from "../../../lib/utils";
import * as Dates from "../../../lib/dateFormatService"

import NoDataFound from "../../../component/nodataFound";
import * as UserService from "../../../services/user";
import * as Validations from "../../../lib/validation"
import * as MasterService from "../../../services/master"

export default function MyAddresses(props) {
    const userData = useSelector(state => state.userData)
    const user = userData?.userData

    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [allStates, setAllStates] = useState([]);
    const [allCities, setAllCities] = useState([]);

    const [allAddresses, setAllAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({});

    const [fullAddress, setFullAddress] = useState(null)
    const [locationError, setLocationError] = useState(null)

    const [fullName, setFullName] = useState(user?.name);
    const [apt, setApt] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [mobileNumber, setMobileNumber] = useState(user?.mobile_number);
    const [addressType, setAddressType] = useState('');

    const [fullNameError, setFullNameError] = useState(null);
    const [addressError, setAddressError] = useState(null);
    const [stateError, setStateError] = useState(null);
    const [cityError, setCityError] = useState(null);
    const [pincodeError, setPincodeError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [mobileNumberError, setMobileNumberError] = useState(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError(Utils.getLanguageLabel("Your browser doesn't support geolocation. Please update your browser."))
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                MasterService.reverseGeoLocation({ lat: position?.coords?.latitude, long: position?.coords?.longitude }).then(response => {
                    setFullAddress(response.data)
                    let tempAddress = []
                    response.data.additionalInformation.address_components.map(addressItem => {
                        if (addressItem.types.includes('sublocality_level_1')) {
                            tempAddress.push(addressItem.long_name)
                        }
                        if (addressItem.types.includes('locality')) {
                            tempAddress.push(addressItem.long_name)
                        }
                        if (addressItem.types.includes('administrative_area_level_2')) {
                            tempAddress.push(addressItem.long_name)
                        }
                        if (addressItem.types.includes('administrative_area_level_1')) {
                            tempAddress.push(addressItem.long_name)
                        }
                    })
                    console.log(tempAddress.join(", "))
                    setAddress(tempAddress.join(", "))
                }).catch(e => { console.log(`getLocation error : ${e}`) })
            }, () => {
                setLocationError(Utils.getLanguageLabel("Please enable the geolocation on your browser."))
            });
        }
    }

    const getUserSavedAddresses = () => {
        setIsLoading(true)
        MasterService.states().then(response => {
            setAllStates(response.data)
            UserService.getUserAddresses().then(response => {
                setAllAddresses(response.data)
                getLocation()
                setIsLoading(false)
            }).catch(e => {
                setIsLoading(false)
                console.log(`getUserAddresses error : ${e}`)
            })
        }).catch(e => {
            setIsLoading(false)
            console.log(`states error : ${e}`)
        })
    }

    const getAllCities = (state) => {
        setState(state)
        setCity('')
        MasterService.cities({ state: state }).then(response => {
            setAllCities(response.data)
        }).catch(e => {
            console.log(`getAllCities error : ${e}`)
        })
    }

    const updateUserAddress = (addressID) => {
        setIsLoading(true)
        UserService.updateUserAddress({ addressID: addressID, primary: "true", deleted: "false" }).then(response => {
            getUserSavedAddresses()
        }).catch(e => {
            setIsLoading(false)
            console.log(`getUserDetail error : ${e}`)
        })
    }

    const deleteUserAddress = () => {
        setShowModal(false)
        UserService.updateUserAddress({ addressID: selectedAddress, primary: "false", deleted: "true" }).then(response => {
            getUserSavedAddresses()
        }).catch(e => {
            setIsLoading(false)
            console.log(`updateUserAddress error : ${e}`)
        })
    }

    const onDeletePopUpPress = (addressID) => {
        setSelectedAddress(addressID)
        setShowModal(true)
    }

    useEffect(() => {
        setIsLoading(true)
        getUserSavedAddresses();
    }, [props])

    const saveUserAddress = () => {
        setIsEditMode(false)
        let postParams = {
            "name": fullName,
            "apt": apt,
            "street": address,
            "state": state,
            "city": city,
            "pincode": pincode,
            "email": email,
            "mobileNumber": mobileNumber,
            "type": "Home",
            "formattedAddress": address,
            "compoundAddress": fullAddress.compoundAddress,
            "lat": fullAddress.latLong.lat,
            "long": fullAddress.latLong.lng
        }

        UserService.addUserAddress(postParams).then(response => {
            window.location.reload()
        }).catch(e => {
            setIsLoading(false)
            console.log(`saveUserAddress error : ${e}`)
        })
    }

    const handleAddressUpdateOrEdit = () => {
        let fullNameValidation = Validations.validateAlphaString(fullName, { emptyField: 'Name cannot be empty', validFiled: 'Please enter a valid name' })
        let mobileNumberValidation = Validations.validateMobile(mobileNumber, {})
        let emailValidation = Validations.validateEmail(email, {})
        let addressValidation = Validations.validateField(address, { emptyField: 'Address cannot be empty' })
        let stateValidation = Validations.validateField(state, { emptyField: 'State cannot be empty' })
        let cityValidation = Validations.validateField(city, { emptyField: 'City cannot be empty' })
        let pincodeValidation = Validations.validateNumericField(pincode, { validField: 'Please enter a valid Pincode' })

        let error = {};

        if (fullNameValidation.error) {
            error['fullName'] = fullNameValidation.message
        }
        if (emailValidation.error) {
            error['email'] = emailValidation.message
        }
        if (mobileNumberValidation.error) {
            error['mobileNumber'] = mobileNumberValidation.message
        }
        if (addressValidation.error) {
            error['address'] = addressValidation.message
        }
        if (stateValidation.error) {
            error['state'] = stateValidation.message
        }
        if (cityValidation.error) {
            error['city'] = cityValidation.message
        }
        if (pincodeValidation.error) {
            error['pincode'] = pincodeValidation.message
        }
        if (Object.keys(error).length == 0) {
            saveUserAddress()
        } else {
            setFullNameError(error.fullName)
            setMobileNumberError(error.mobileNumber)
            setEmailError(error.email)
            setAddressError(error.address)
            setStateError(error.state)
            setCityError(error.city)
            setPincodeError(error.pincode)
            return false;
        }
    }

    const handleAddressClose = () => {
        setFullName(user.name);
        setEmail(user.email);
        setMobileNumber(user.mobile_number);
        window.hideAddressModal()
    }

    const onAddPress = (item) => {
        setIsEditMode(false)
        setFullName(user.name)
        setApt('')
        setState('')
        setCity('')
        setPincode('')
        setEmail(user.email)
        setMobileNumber(user.mobile_number)
        setAddressType('Home')
        setSelectedAddress({})
        setTimeout(() => { window.showAddressModal() }, 200)
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>My Addresses | Teambuy</title>
                <meta name="description" content="My Addresses | Teambuy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="breadcrumb-wrap">
                <div className="container">
                    <nav className="custom-breadcrumb global-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/" }}>
                                    <a>{Utils.getLanguageLabel("Home")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/account" }}>
                                    <a>{Utils.getLanguageLabel("My account")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("My Addresses")}</li>
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
                                <div className="add-new-box mb-30">
                                    <a style={{ cursor: 'pointer' }} onClick={() => onAddPress()} className="white-box blue-box d-block b-none">
                                        <Image layout='raw' style={{ objectFit: 'contain' }} height={25} width={25} alt="add-new-location" src="/img/add-new-icon.png" /> {Utils.getLanguageLabel("Add new address")}
                                    </a>
                                </div>
                                {allAddresses.length < 1 &&
                                    <NoDataFound
                                        image="/bgicon/location.png"
                                        title="No Saved Addresses"
                                        subtitle="Please add a new address."
                                    />}
                                {allAddresses.map(item => {
                                    return <div key={`all_saved_address_${item.id}`} className={`white-box address-box mb-20 ${item.is_primary == 1 ? 'selected' : ''}`}>
                                        <div type="radio" name="deliveryAddress" className="addressCheck" />
                                        {item.is_primary == 1 && <span className="default-tag">{Utils.getLanguageLabel("Default")}</span>}
                                        <div className="d-flex align-items-center">
                                            <div className="loaction-icon">
                                                <Image layout='raw' style={{ objectFit: 'contain' }} height={45} width={45} alt="location" src="/img/location.png" />
                                            </div>

                                            <div className="pl-15">
                                                <div className="xs-heading fw-500">{item.full_name}</div>
                                                <div className="xs-content mt-15">{item.apt}, {item.formatted_address}, {item.pincode}</div>
                                                <div className="xs-content mt-15 fw-500">+91 {item.mobile_number}</div>
                                            </div>


                                            <div className='ml-auto d-flex'>
                                                {item.is_primary != 1 ? <button onClick={() => updateUserAddress(item.id)} type="button" className="green-btn">{Utils.getLanguageLabel("Make Default")}</button> : null}
                                                <button onClick={() => onDeletePopUpPress(item.id)} type="button" className="red-btn mx-2">{Utils.getLanguageLabel("Delete")}</button>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Feature />

            <ConfirmModal
                subTitle="You want to remove this address?"
                showModal={showModal}
                onCancelPress={() => setShowModal(false)}
                onConfirmPress={() => deleteUserAddress()} />

            <div className="modal fade custom-modal" id="addAddressModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-body">
                        <div className="modal-content">
                            <div className="d-flex align-items-center modal-header">
                                <h5 className="modal-title" >{Utils.getLanguageLabel("add new address")}</h5>
                                <div className="ml-auto">
                                    <a style={{ cursor: 'pointer' }} onClick={() => handleAddressClose()} className="red-text font-13 font-poppins text-uppercase">close</a>
                                </div>
                            </div>
                            <form className="custom-form mt-30 mb-30 px-3">
                                <div className="row">
                                    <div className="col-md-6 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setFullName(event.target.value) }} value={fullName} type="text" className="form-control" placeholder={Utils.getLanguageLabel("Full name")} />
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{fullNameError}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setMobileNumber(event.target.value) }} value={mobileNumber} type="text" className="form-control" placeholder={Utils.getLanguageLabel("Mobile number")} />
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{mobileNumberError}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setEmail(event.target.value) }} value={email} type="text" className="form-control" placeholder={Utils.getLanguageLabel("Email address (for invoice and update)")} />
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{emailError}</span>
                                        </div>
                                    </div>
                                    <div className="col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setAddress(event.target.value) }} value={address} type="text" className="form-control" placeholder={Utils.getLanguageLabel("Enter your locality")} />
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{addressError}</span>
                                        </div>
                                    </div>
                                    <div className="col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setApt(event.target.value) }} value={apt} type="text" className="form-control" placeholder={Utils.getLanguageLabel("Enter your full address")} />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setAddressType(event.target.value) }} value={addressType} type="text" className="form-control" placeholder="Address type (Home/Work/Office)" />
                                        </div>
                                    </div> */}
                                    <div className="col-md-4 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <select onChange={(event) => getAllCities(event.target.value)} value={state} className="form-control">
                                                <option>{Utils.getLanguageLabel("Select state")}</option>
                                                {
                                                    allStates.map(item => {
                                                        return <option key={`${item.state}`} value={item.state}>{item.state}</option>
                                                    })
                                                }
                                            </select>
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{stateError}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <select onChange={(event) => setCity(event.target.value)} value={city} className="form-control">
                                                <option>{Utils.getLanguageLabel("Select city")}</option>
                                                {
                                                    allCities.map(item => {
                                                        return <option key={`${item.city}`} value={item.city}>{item.city}</option>
                                                    })
                                                }
                                            </select>
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{cityError}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-12 pb-4">
                                        <div className="form-group pos-rel">
                                            <input onChange={(event) => { setPincode(event.target.value) }} value={pincode} type="number" className="form-control" placeholder={Utils.getLanguageLabel("PIN code")} />
                                            <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{pincodeError}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 text-end">
                                    <button type='button' onClick={() => handleAddressUpdateOrEdit()} className="green-btn mnw-248">{Utils.getLanguageLabel("add new address")}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Script id="my-address-script" strategy="afterInteractive" >
                {`
                    $(".jq_set_default").click(function(){
                        $(".address-box").removeClass("selected");
                        $(".jq_set_default").text("make default");
                        $(this).closest(".address-box").addClass("selected");
                        $(this).text("Default address");
                    });  

                    function hideAddressModal(){
                        $(document).ready(function(){
                            $('#addAddressModal').modal('hide');
                        });
                    }

                    function showAddressModal(){
                        $(document).ready(function(){
                            $('#addAddressModal').modal('show');
                        });
                    }
                `}
            </Script>
        </>
    )
}