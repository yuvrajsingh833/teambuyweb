import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const allProducts = async ({ limit = 10, page = 1, sortby = 'name', order = 'asc', userType = 'customer' }) => {
    let queryString = { limit, page, sortby, order, userType };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.allProducts.endPoint, API.allProducts.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const allProductByCategory = async ({ categoryID, limit = 10, page = 1, sortby = 'name', order = 'asc', userType = 'customer' }) => {
    let queryString = { limit, page, sortby, order, userType };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.allProductByCategory.endPoint, API.allProductByCategory.url + '/' + categoryID + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const productDetail = async ({ productID, userType = 'customer' }) => {
    let queryString = { userType };

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.productDetail.endPoint, API.productDetail.url + '/' + productID + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}
export { allProducts, allProductByCategory, productDetail }
