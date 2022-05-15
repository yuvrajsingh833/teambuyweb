import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const allCategory = async () => {
    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.allCategory.endPoint, API.allCategory.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const subCategory = async ({ categoryID }) => {
    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.subCategory.endPoint, API.subCategory.url + '/' + categoryID, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { allCategory, subCategory }
