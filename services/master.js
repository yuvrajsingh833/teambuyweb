import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const dashboard = async ({ userType }) => {
    let queryString = { userType };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.dashboard.endPoint + '?' + Utils.JSONToQueryString(queryString), null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const search = async ({ product, page = 1, limit = 10, hasFilter = false, category = 1, minPrice = 0, maxPrice = 0, rating = 0, userType = 'customer' }) => {
    let queryString = { product, page, limit, hasFilter, category, minPrice, maxPrice, rating, userType }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.search.endPoint + '?' + Utils.JSONToQueryString(queryString), null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const reverseGeoLocation = async ({ lat, long }) => {
    let queryString = { lat, long };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.reverseGeoLocation.endPoint, API.reverseGeoLocation.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const calculateDistance = async ({ origins, destinations }) => {
    let queryString = { origins, destinations };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.calculateDistance.endPoint, API.calculateDistance.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { dashboard, search, reverseGeoLocation, calculateDistance }
