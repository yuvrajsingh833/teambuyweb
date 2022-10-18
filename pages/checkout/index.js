import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useSelector } from 'react-redux';

import Loader from '../../component/loader';

import { Config } from '../../config/config';
import * as Utils from "../../lib/utils";

import Feature from "../../component/feature";

import * as Validations from "../../lib/validation";
import * as CheckoutService from "../../services/checkout";
import * as MasterService from "../../services/master";
import * as PaymentService from "../../services/payment";
import * as UserService from "../../services/user";

export default function CheckoutPage(props) {
    const couponApplied = Utils.getStateAsyncStorage("appliedCoupon")

    const userData = useSelector(state => state.userData)
    const user = userData?.userData
    global.user = userData?.userData

    const [isLoading, setIsLoading] = useState(true);
    const [appliedCoupon, setAppliedCoupon] = useState((couponApplied && Object.keys(couponApplied).length > 0) ? couponApplied : null);

    const [cartItems, setCartItems] = useState([]);

    const [GSTAmount, setGSTAmount] = useState(0);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [couponDiscount, setCouponDiscount] = useState(0);

    const [hasOutOfStockProduct, setHasOutOfStockProduct] = useState(false);

    const [teambuyOfferPrice, setTeambuyOfferPrice] = useState(0);

    const [walletInfo, setWalletInfo] = useState({});

    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [minCartForFreeDelivery, setMinCartForFreeDelivery] = useState(0);
    const [maxUsableWalletAmount, setMaxUsableWalletAmount] = useState(0);
    const [maxUsableWalletPercent, setMaxUsableWalletPercent] = useState(0);

    const [showAddressModal, setShowAddressModal] = useState(false);

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

    const getAllCartItems = () => {
        setIsLoading(true)
        CheckoutService.getCart().then(response => {
            let gst = 0;
            let subTotal = 0;
            let teambuyOfferDiscount = 0;

            response.data.map(mapItems => {
                if (!(mapItems.product_info.stock >= mapItems.product_info.reserve_stock && mapItems.product_info.stock != 0)) {
                    setHasOutOfStockProduct(true)
                }
                gst = gst + (mapItems.product_info.gst_amount * mapItems.quantity)
                subTotal = subTotal + (mapItems.product_info.price_without_gst * mapItems.quantity)
                teambuyOfferDiscount = teambuyOfferDiscount + (mapItems.product_info.teambuy_offer_price * mapItems.quantity)
            })

            setSubTotalAmount(subTotal)
            setTeambuyOfferPrice(teambuyOfferDiscount)
            setGSTAmount(gst)
            setCartItems(response.data)
            setIsLoading(false)
            getUserSavedAddresses()
        }).catch(e => {
            console.log(`getCart error : ${e}`)
            setCartItems([])
            setIsLoading(false)
        })
    }

    useEffect(() => {

        setIsLoading(true)
        setCartItems([]);
        setGSTAmount(0);
        setSubTotalAmount(0);
        setCouponDiscount(0);
        setWalletInfo({});
        setDeliveryCharge(0);
        setMinCartForFreeDelivery(0);
        setMaxUsableWalletAmount(0);
        setMaxUsableWalletPercent(0);

        PaymentService.allWalletTransactions({ limit: Config.PageSize, page: 1 }).then(response => {
            setWalletInfo(response.data.information)
            MasterService.settings().then(settingResponse => {
                (settingResponse.data).map(settingItem => {
                    if (settingItem.key == "delivery_charge") {
                        setDeliveryCharge(settingItem.value)
                    }
                    if (settingItem.key == "free_delivery_min_cart") {
                        setMinCartForFreeDelivery(settingItem.value)
                    }
                    if (settingItem.key == "max_wallet_amount") {
                        setMaxUsableWalletAmount(settingItem.value)
                    }
                    if (settingItem.key == "cart_wallet_applicable_percent") {
                        setMaxUsableWalletPercent(settingItem.value)
                    }
                })

            }).catch(e => { console.log(`settings error : ${e}`) })
        }).catch(e => { console.log(`allWalletTransactions error : ${e}`) })

        getAllCartItems();
    }, [props])

    const calculatePrice = () => {

        /** Price before discount calculated */
        let subTotal = subTotalAmount

        /** GST Charge calculation */
        let appliedGSTAmount = GSTAmount

        /** Wallet discount calculation */

        let appliedWalletAmount = walletInfo?.amount || 0

        if (walletInfo && walletInfo?.amount > 0) {
            let walletDiscountPercentAmount = (maxUsableWalletPercent / 100) * subTotal;
            if (Number(walletDiscountPercentAmount) >= Number(maxUsableWalletAmount)) {
                appliedWalletAmount = maxUsableWalletAmount
                if (walletInfo.amount < appliedWalletAmount) {
                    appliedWalletAmount = walletInfo.amount
                }
            } else {
                appliedWalletAmount = walletDiscountPercentAmount.toFixed(2)
                if (walletInfo.amount < appliedWalletAmount) {
                    appliedWalletAmount = walletInfo.amount
                }
            }
        }

        /** Coupon discount calculation */
        let appliedDiscountAmount = couponDiscount;

        let totalAmount = subTotal + appliedGSTAmount;

        // let discountAmount = 0
        if (appliedCoupon) {
            if (appliedCoupon.type == 'percent') {
                appliedDiscountAmount = totalAmount * (appliedCoupon.discount / 100)
                if (appliedDiscountAmount > appliedCoupon.max_discount_amount && appliedCoupon.max_discount_amount != 0) {
                    appliedDiscountAmount = appliedCoupon.max_discount_amount
                }
            } else {
                appliedDiscountAmount = appliedCoupon.discount
            }
        }

        /**Calculate teambuy discount */
        let appliedTeambuyDiscount = teambuyOfferPrice;

        /** Delivery charge calculation */
        let appliedDeliveryCharges = deliveryCharge
        if (Number(subTotal) >= Number(minCartForFreeDelivery)) {
            appliedDeliveryCharges = 0
        }

        /** Total payable price calculation */
        let totalPrice = (Number(subTotal) + Number(appliedDeliveryCharges) + Number(appliedGSTAmount)) - (Number(appliedDiscountAmount) + Number(appliedWalletAmount))

        return {
            SUB_TOTAL: subTotal,

            APPLICABLE_WALLET_DISCOUNT: appliedWalletAmount,
            APPLICABLE_COUPON_DISCOUNT: appliedDiscountAmount,

            APPLICABLE_DELIVERY_CHARGE: appliedDeliveryCharges,
            APPLIED_GST: appliedGSTAmount,

            APPLIED_TEAM_BUY_DISCOUNT: appliedTeambuyDiscount,

            TOTAL: totalPrice
        }
    }

    const saveUserAddress = () => {
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
        setShowAddressModal(false)
    }

    const onAddPress = () => {
        setFullName(user.name)
        setApt('')
        setState('')
        setCity('')
        setPincode('')
        setEmail(user.email)
        setMobileNumber(user.mobile_number)
        setAddressType('Home')
        setSelectedAddress({})
        setShowAddressModal(true)
    }

    if (isLoading) return <Loader />

    return (
        <>
            <Head>
                <title>Cart | Teambuy</title>
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
                            <li className="breadcrumb-item">
                                <Link passHref href={{ pathname: "/cart" }}>
                                    <a>{Utils.getLanguageLabel("Cart")}</a>
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{Utils.getLanguageLabel("Checkout")}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {cartItems.length > 0 && <section className="cart-wrap ptb-40">
                <div className="container">
                    <div className="row cart-block">
                        <div className="col-lg-6">
                            <div className="white-box cart-table-block">
                                <div className="cart-pd-20">
                                    <div className="sm-heading fw-500">{Utils.getLanguageLabel("Bill Details")}</div>
                                    <div className="cart-table">
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Sub total")}</td>
                                                    <td className="text-right">{Utils.convertToPriceFormat(calculatePrice().SUB_TOTAL)}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td>{Utils.getLanguageLabel("Team buy discount")}</td>
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT)}</td>
                                                </tr> */}
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Coupon discount")}</td>
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLICABLE_COUPON_DISCOUNT)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Wallet discount")}</td>
                                                    <td className="green-text text-right">-{Utils.convertToPriceFormat(calculatePrice().APPLICABLE_WALLET_DISCOUNT)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("Delivery Charge")}</td>
                                                    <td className="red-text text-right">+{Utils.convertToPriceFormat(calculatePrice().APPLICABLE_DELIVERY_CHARGE)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{Utils.getLanguageLabel("GST")}</td>
                                                    <td className="red-text text-right">+{Utils.convertToPriceFormat(calculatePrice().APPLIED_GST)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-500">{Utils.getLanguageLabel("Total payable amount")}</td>
                                                    <td className="fw-500 text-right">{Utils.convertToPriceFormat(calculatePrice().TOTAL)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {(Number(calculatePrice().APPLICABLE_COUPON_DISCOUNT) + Number(calculatePrice().APPLIED_TEAM_BUY_DISCOUNT)) > 0 && <div className="yellow-bg offer-discount-box plr-20 b-radius-0 mt-10">
                                    <span className="sm-heading">You saved <span className="green-text fw-700">{Utils.convertToPriceFormat(Number(calculatePrice().APPLICABLE_COUPON_DISCOUNT) + Number(calculatePrice().APPLICABLE_WALLET_DISCOUNT))}</span> on this order</span>
                                </div>}
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="sm-heading fw-500">Choose address
                                <a style={{ cursor: 'pointer' }} onClick={() => onAddPress()} className="green-text ml-15 text-uppercase font-13">+ {Utils.getLanguageLabel("Add new address")}
                                </a>
                            </div>

                            <div className="row mt-10 address-block">
                                {allAddresses.map(item => {
                                    return <div key={`all_saved_address_${item.id}`} className="col-md-12 mb-20">
                                        <div className="white-box address-box selected">
                                            {item.is_primary == 1 && <span className="default-tag">{Utils.getLanguageLabel("Default")}</span>}
                                            <span className="ad-select-icon"><Image alt='/img/sm-green-check.svg' height={40} width={40} layout='raw' src="/img/sm-green-check.svg" /></span>
                                            <div className="d-flex align-items-center">
                                                <div className="loaction-icon">
                                                    <Image layout='raw' style={{ objectFit: 'contain' }} height={45} width={45} alt="location" src="/img/location.png" />
                                                </div>
                                                <div className="pl-15">
                                                    <div className="xs-heading fw-500">{item.full_name}</div>
                                                    <div className="xs-content mt-15">{item.apt}, {item.formatted_address}, {item.pincode}</div>
                                                    <div className="xs-content mt-15 fw-500">+91 {item.mobile_number}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                            {hasOutOfStockProduct && <div className="process-checkout-btn text-center mt-30"><button type="button" className="cancel-btn gray-tag-small">Some product are Out of stock</button></div>}

                            {!hasOutOfStockProduct && <div className="text-center mt-30">
                                <Link passHref href={{ pathname: '/checkout' }}>
                                    <button className="green-btn process-checkout-btn">
                                        {Utils.getLanguageLabel("proceed to checkout")}
                                        <Image height={15} width={15} layout="raw" src="/img/white-right-arrow.svg" alt="img/white-right-arrow.svg" />
                                    </button>
                                </Link>
                            </div>}
                        </div>
                    </div>
                </div>
            </section>}

            {cartItems.length < 1 && <section className="cart-wrap">
                <div className="empty-cart">
                    <div className="ce-icon text-center">
                        <Image layout='raw' style={{ objectFit: 'contain' }} height={140} width={140} quality={100} alt="empty-wishlist" src="/img/empty-cart.png" />
                    </div>
                    <div className="sm-heading text-center mt-30">{Utils.getLanguageLabel("Your cart in empty!")}</div>
                    <div className="xs-heading text-center font-12">{Utils.getLanguageLabel("Shop for some product in order")} <br />
                        {Utils.getLanguageLabel("to purchase them")}</div>
                    <div className="text-center mt-20">
                        <Link passHref href={{ pathname: '/category' }}>
                            <button className="green-btn">{Utils.getLanguageLabel("SHOp NOW")}</button>
                        </Link>
                    </div>
                </div>
            </section>}

            <Modal
                className="modal fade custom-modal"
                aria-labelledby="staticBackdropLabel"
                centered
                backdrop="static"
                keyboard={false}
                show={showAddressModal}
                onHide={() => handleAddressClose()}>
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
            </Modal>

            <Feature />
        </>
    )

}