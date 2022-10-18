import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const states = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.states.endPoint, null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const cities = async ({ state }) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.cities.endPoint, state, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const settings = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.settings.endPoint, null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const languages = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.languages.endPoint, null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const languagesLabel = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.languagesLabel.endPoint, null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const deliveryPinCode = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.deliveryPinCode.endPoint, null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

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

const searchSuggestion = async ({ searchText }) => {
    let queryString = { searchText }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.searchSuggestion.endPoint + '?' + Utils.JSONToQueryString(queryString), null, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const search = async ({ product, page = 1, limit = 10, hasFilter = false, category = 1, minPrice = 0, maxPrice = 0, rating = 0, userType = 'business' }) => {
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

const faqs = async ({ type }) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.faqs.endPoint, type, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const subscribeNewsletter = async ({ email }) => {
    let postParams = { email }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.subscribeNewsletter.endPoint, API.subscribeNewsletter.url, postParams)
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

export { states, cities, settings, languages, languagesLabel, deliveryPinCode, dashboard, search, searchSuggestion, faqs, subscribeNewsletter, reverseGeoLocation, calculateDistance }
