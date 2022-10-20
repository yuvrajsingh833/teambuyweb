import * as Utils from "../lib/utils";
import { API } from "../config/urls";
import * as HTTPRequest from "../lib/httpRequest";

const getNearbyTeams = async ({ teamPincode }) => {
    let postParams = { teamPincode }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.getNearbyTeams.endPoint, API.getNearbyTeams.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const uploadTeamImage = async (teamAvatar) => {

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.uploadTeamImage.endPoint, API.uploadTeamImage.url, teamAvatar, {}, true, false)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const createTeam = async ({ teamAvatar, teamName, teamLocation, teamPincode }) => {
    let postParams = { teamAvatar, teamName, teamLocation, teamPincode }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.createTeam.endPoint, API.createTeam.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { getNearbyTeams, uploadTeamImage, createTeam }