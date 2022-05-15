import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const getUserDetail = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getUserDetail.endPoint, API.getUserDetail.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const updateUserAvatar = async (userAvatar) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.updateUserAvatar.endPoint, API.updateUserAvatar.url, userAvatar, {}, true, false)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const updateUserProfileInfo = async ({ mobileNumber, name, email }) => {
    let postParams = { mobileNumber, name, email }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.updateUserProfileInfo.endPoint, API.updateUserProfileInfo.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const getUserAddresses = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getUserAddresses.endPoint, API.getUserAddresses.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const addUserAddress = async ({ name, apt, street, state, city, pincode, email, mobileNumber, type, formattedAddress, compoundAddress, lat, long }) => {
    let postParams = { name, apt, street, state, city, pincode, email, mobileNumber, type, formattedAddress, compoundAddress, lat, long }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.addUserAddress.endPoint, API.addUserAddress.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const updateUserAddress = async ({ addressID, primary, deleted }) => {
    let postParams = { addressID, primary, deleted }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.updateUserAddress.endPoint, API.updateUserAddress.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const getUserWishlist = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getUserWishlist.endPoint, API.getUserWishlist.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const updateUserWishlist = async ({ productID }) => {
    let postParams = { productID }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.updateUserWishlist.endPoint, API.updateUserWishlist.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const updateUserCart = async ({ productID, quantity, cartType }) => {
    let postParams = { productID, quantity, cartType }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.updateUserCart.endPoint, API.updateUserCart.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const addProductReview = async ({ productID, rating, comment }) => {
    let postParams = { productID, rating, comment }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.addProductReview.endPoint, API.addProductReview.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const getAllOrders = async ({ limit = 10, page = 1 }) => {
    let queryString = { limit, page };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getAllOrders.endPoint, API.getAllOrders.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const getOrderDetail = async ({ orderID }) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getOrderDetail.endPoint, API.getOrderDetail.url + '/' + orderID, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { getUserDetail, updateUserAvatar, updateUserProfileInfo, getUserAddresses, addUserAddress, updateUserAddress, getUserWishlist, updateUserWishlist, updateUserCart, addProductReview, getAllOrders, getOrderDetail }
