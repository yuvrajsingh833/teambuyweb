import * as Enums from "./enums";
import * as URL from "../config/urls";

const GetFormBody = (data) => {
    let formBody = [];
    for (let property in data) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

const SiteURL = (endpoint = "guest") => { return URL.API_BASE_URL + endpoint + "/"; }

const StripTrailingSlash = (str) => {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

const MakeApiRequest = async (url, endpoint = null, data, headers = {}, method = "POST", isRaw = false, isJson = true, altURL = null, showError = true, responseTypeFile = false) => {

    let otherURL = altURL != null ? altURL : SiteURL(endpoint);
    otherURL = (endpoint != null && altURL != null) ? otherURL + endpoint + "/" : otherURL;

    const URL = ((url ? otherURL : StripTrailingSlash(otherURL)) + (url ? url : '')).replace(/([^:])(\/\/+)/g, '$1/');;

    let body = isRaw ? data : isJson ? JSON.stringify(data) : GetFormBody(data);

    headers["Accept"] = "application/json";
    headers["Content-Type"] = isRaw ? "multipart/form-data" : isJson ? "application/json" : "application/x-www-form-urlencoded";

    console.log("URL => ", URL)
    // console.log("REQUEST => ", body)
    // console.log("HEADER => ", headers)

    if (responseTypeFile) {
        return fetch(URL, { method: method, headers: headers, body: body, })
            .then(response => { return response.blob() })
            .then(data => {
                // console.log("RESPONSE => ", data)
                return data;
            })
            .catch(e => {
                try {
                    const error = JSON.parse(e.message);
                    // if (showError) { Alert.error(error.message); }
                } catch (e) {
                    // if (showError) { Alert.error(Enums.GlobalMessages.serverError); }
                }
                return false;
            });
    } else {
        let option = {};

        if (method == "GET") {
            option = { method: method, headers: headers }
        } else {
            option = { method: method, headers: headers, body: body }
        }

        return await fetch(URL, option)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // console.log("RESPONSE => ", data)
                if (data === false || typeof data !== "object") {
                    // if (showError) { Alert.error(Enums.GlobalMessages.somethingWentWrong); }
                    return false;
                } else if (data.success == false) {
                    // if (showError) { Alert.error(data.message); }
                } else {
                    return data;
                }
            })
            .catch(e => {
                console.log("e====>", e)
                try {
                    // if (showError) { Alert.error(Enums.GlobalMessages.networkRequestFailed); }
                } catch (e) {
                    // if (showError) { Alert.error(Enums.GlobalMessages.serverError); }
                }
                return false;
            });
    }
}

const Get = (endPoint = '', url = '', params = null, headers = {}, isRaw = false, isJson = false, altURL = null, showError = true) => {
    headers["Authorization"] = (global.userData && global.userData.token) ? `Bearer ${global.userData.token}` : '';
    return new Promise(function (resolve, reject) {
        try {
            MakeApiRequest(url, endPoint, params, headers, "GET", isRaw, isJson, altURL, showError)
                .then(result => {
                    if (result) {
                        resolve(result)
                    } else if (result == false) {
                        reject(false)
                    } else {
                        reject(false)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
}

const Post = (endPoint = '', url = '', params = null, headers = {}, isRaw = false, isJson = true, altURL = null, showError = true, responseTypeFile = false) => {
    headers["Authorization"] = (global.userData && global.userData.token) ? `Bearer ${global.userData.token}` : '';
    return new Promise(function (resolve, reject) {
        try {
            MakeApiRequest(url, endPoint, params, headers, "POST", isRaw, isJson, altURL, showError, responseTypeFile)
                .then(result => {
                    if (result) {
                        resolve(result)
                    } else if (result == false) {
                        reject(false)
                    } else {
                        reject(false)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
}

const Put = (endPoint = '', url = '', params = null, headers = {}, isRaw = false, isJson = true, altURL = null, showError = true, responseTypeFile = false) => {
    headers["Authorization"] = (global.userData && global.userData.token) ? `Bearer ${global.userData.token}` : '';
    return new Promise(function (resolve, reject) {
        try {
            MakeApiRequest(url, endPoint, params, headers, "PUT", isRaw, isJson, altURL, showError, responseTypeFile)
                .then(result => {
                    if (result) {
                        resolve(result)
                    } else if (result == false) {
                        reject(false)
                    } else {
                        reject(false)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
}

const Delete = (endPoint = '', url = '', headers = {}, isRaw = false, isJson = true, altURL = null, showError = true, responseTypeFile = false) => {
    headers["Authorization"] = (global.userData && global.userData.token) ? `Bearer ${global.userData.token}` : '';
    return new Promise(function (resolve, reject) {
        try {
            MakeApiRequest(url, endPoint, {}, headers, "DELETE", isRaw, isJson, altURL, showError, responseTypeFile)
                .then(result => {
                    if (result) {
                        resolve(result)
                    } else if (result == false) {
                        reject(false)
                    } else {
                        reject(false)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
}
export { MakeApiRequest, GetFormBody, Get, Post, Put, Delete }