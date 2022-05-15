import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const uploadBusinessImage = async (userAvatar) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.uploadBusinessImage.endPoint, API.uploadBusinessImage.url, userAvatar, {}, true, false)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const register = async ({ name, companyName, mobileNumber, email, gstNumber, userType, businessImage }) => {
    let postParams = { name, companyName, mobileNumber, email, gstNumber, userType, businessImage }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.register.endPoint, API.register.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const sendOTP = async ({ mobileNumber, hash, userType }) => {
    let postParams = { mobileNumber, hash, userType }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.sendOTP.endPoint, API.sendOTP.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const verifyOTP = async ({ mobileNumber, userType, otp, deviceIP, deviceID, deviceToken, deviceType, appVersion, userID }) => {
    let postParams = { mobileNumber, userType, otp, deviceIP, deviceID, deviceToken, deviceType, appVersion, userID }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.verifyOTP.endPoint, API.verifyOTP.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const logout = async ({ userID, deviceID }) => {
    let postParams = { userID, deviceID }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.logout.endPoint, API.logout.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { uploadBusinessImage, register, sendOTP, verifyOTP, logout }
