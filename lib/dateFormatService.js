import moment from 'moment';
import * as Enums from "./enums";
import { Config } from '../config/appConfig';

function momentDateFormat(date, dateFormat) {

    if (date != null && date != "") {
        return moment(date).format(dateFormat);
    }
    else {
        return '-'
    }
}

function convertDateToRelativeDisplayText(time) {
    if (time != '' && time != null && time != undefined) {
        let now = new Date();
        let now_utc = getUTCTimestamp(now) * 1000;
        let date = new Date(time),
            diff = ((now_utc - Date.parse(time)) / 1000),
            day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff)/* || day_diff < 0 || day_diff >= 31*/)
            return;
        return day_diff == 0 && (
            diff < 60 && "just now" ||
            diff < 120 && "1 min ago" ||
            diff < 3600 && Math.floor(diff / 60) + " mins ago" ||
            diff < 7200 && "1 hr ago" ||
            diff < 86400 && Math.floor(diff / 3600) + " hrs ago") ||
            day_diff < 0 && diff < 60 && "just now" ||
            day_diff == 1 && "Yesterday" ||
            day_diff > 0 && day_diff < 7 && day_diff + " days ago" ||
            momentDateFormat(time, "D MMM, YYYY");
    } else {
        return;
    }

};

function addMonths(date, months, dateFormat) {
    return moment(date).add(months, 'months').format(dateFormat);
}

function subtractMonths(date, months, dateFormat) {
    return moment(date).subtract(months, 'months').format(dateFormat);
}

function subtractDays(date, days, dateFormat) {
    return moment(date).subtract(days, 'day').format(dateFormat);
}

function addDays(date, days, dateFormat) {
    return moment(date).add(days, 'day').format(dateFormat);
}

function checkDateGreater(fromDate, endDate) {
    var diffDays = ((Date.parse(endDate) - Date.parse(fromDate)) / 1000);
    if (diffDays > 0) {
        return true;
    } else {
        return false;
    }
}

function checkDateGreaterEqual(fromDate, endDate) {
    var startDate1 = moment(fromDate, Enums.DateFormat.DDMMYYYY);
    var endDate1 = moment(endDate, Enums.DateFormat.DDMMYYYY);
    var result = endDate1.diff(startDate1, 'days');

    if (result >= 0) {
        return true;
    } else {
        return false;
    }
}

function getDayDifference(fromDate, endDate) {
    var diff = Math.abs(endDate - fromDate);
    return Number(Math.floor(diff / (60 * 60 * 24))).toFixed(0);
}

function getMonthDifference(fromDate, endDate) {
    return 12 * (moment(endDate).year() - moment(fromDate).year())
        + moment(endDate).month() - moment(fromDate).month() + 1;
}

function getMonthDifferenceActivities(fromDate, endDate) {
    return 12 * (moment(endDate).year() - moment(fromDate).year())
        + moment(endDate).month() - moment(fromDate).month();
}

function getCurrentYear() {
    var date = new Date();
    return date.getFullYear();
}

function getCurrentDate() {
    var date = new Date();
    return (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + "/" + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "/" + date.getFullYear();
}

function getYearList() {
    var currentYear = new Date().getFullYear(),
        yearsList = [];
    let startYear = 2018;
    while (startYear <= currentYear) {
        yearsList.push(startYear++);
    }
    return yearsList;
}

function getNotificationDateFormat(date) {
    return moment(date).format("h:mm A, Do MMM YY");
}

function weekStartAndEndDate() {
    var now = new Date();
    let start = 1;
    var today = new Date(now.setHours(0, 0, 0, 0));
    var day = today.getDay() - start;
    var date = today.getDate() - day;

    // Grabbing Start/End Dates
    var StartDate = new Date(today.setDate(date));
    var EndDate = new Date(today.setDate(date + 6));
    return [StartDate, EndDate];

}

function monthStartAndEndDate() {

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m + 1, 1);
    var lastDay = new Date(y, m + 1, 0);

    var date = new Date();
    var StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    var EndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return [firstDay, lastDay];

}

//get utc date time stamp
function getUTCTimestamp(date) {
    var d1 = date;
    var utcDate = d1.toUTCString();
    var timeStamp = new Date(utcDate).getTime() / 1000;
    return Math.floor(timeStamp);
}

//get utc date time stamp
function convertTimestampToUTCDate(timeStamp) {
    var date = new Date(timeStamp * 1000);
    return date.toUTCString();
}

function localDate(date) {
    return momentDateFormat((date * 1000), Config.DateFormat);
}

export {
    momentDateFormat, convertDateToRelativeDisplayText, addMonths, subtractMonths, subtractDays, addDays, checkDateGreater, checkDateGreaterEqual, getDayDifference, getMonthDifference, getMonthDifferenceActivities, getCurrentYear, getCurrentDate, getYearList, getNotificationDateFormat, weekStartAndEndDate, monthStartAndEndDate, getUTCTimestamp, convertTimestampToUTCDate, localDate
}