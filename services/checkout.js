import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const getCart = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getCart.endPoint, API.getCart.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const getAllCoupons = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.getAllCoupons.endPoint, API.getAllCoupons.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const checkCouponValidation = async ({ coupon }) => {
    let postParams = { coupon }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.checkCouponValidation.endPoint, API.checkCouponValidation.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { getCart, getAllCoupons, checkCouponValidation }
