import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const allPaymentTransactions = async ({ limit = 10, page = 1 }) => {
    let queryString = { limit, page };
    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.allPaymentTransactions.endPoint, API.allPaymentTransactions.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const allWalletTransactions = async ({ limit = 10, page = 1 }) => {
    let queryString = { limit, page };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.allWalletTransactions.endPoint, API.allWalletTransactions.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const createPayment = async (postParams) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.createPayment.endPoint, API.createPayment.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const paymentGateway = async (postParams) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.paymentGateway.endPoint, API.paymentGateway.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const verifyPayment = async (postParams) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.verifyPayment.endPoint, API.verifyPayment.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const updatePayment = async (postParams) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.updatePayment.endPoint, API.updatePayment.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { allPaymentTransactions, allWalletTransactions, createPayment, paymentGateway, verifyPayment, updatePayment }
