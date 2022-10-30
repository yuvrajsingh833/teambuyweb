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

const getMyTeams = async ({ teamPincode }) => {
    let postParams = { teamPincode }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.getMyTeams.endPoint, API.getMyTeams.url, postParams)
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

const createTeam = async ({ teamAvatar, teamName, teamLocation, teamPincode, teamLeaderOff, teamMemberOff }) => {
    let postParams = { teamAvatar, teamName, teamLocation, teamPincode, teamLeaderOff, teamMemberOff }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.createTeam.endPoint, API.createTeam.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const teamInfo = async ({ teamCode }) => {
    let postParams = { teamCode }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.teamInfo.endPoint, API.teamInfo.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

const joinTeam = async ({ teamCode }) => {
    let postParams = { teamCode }

    return new Promise(function (resolve, reject) {
        HTTPRequest.Post(API.joinTeam.endPoint, API.joinTeam.url, postParams)
            .then(result => {
                resolve(result)
            }).catch(e => {
                reject(e)
            })
    })
}

export { getMyTeams, getNearbyTeams, uploadTeamImage, createTeam, teamInfo, joinTeam }