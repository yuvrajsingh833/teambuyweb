import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const allNotification = async ({ page = 1, limit = 10 }) => {
    let queryString = { page, limit }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.allNotification.endPoint, API.allNotification.url + '?' + Utils.JSONToQueryString(queryString), null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const markNotificationRead = async () => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Get(API.markNotificationRead.endPoint, API.markNotificationRead.url, null)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { allNotification, markNotificationRead }
