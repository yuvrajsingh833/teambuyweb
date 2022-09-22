import { Config } from "../config/appConfig";
import { setCookie, getCookie } from 'cookies-next';

const getStateAsyncStorage = (item = "appData", optionalData = null) => {
	try {
		if (typeof window !== 'undefined') {
			let savedState = localStorage.getItem(item);
			if (savedState !== null) {
				let parsedState = JSON.parse(savedState);
				return parsedState;
			} else {
				return {};
			}
		} else {

			let savedState = null
			if (optionalData) {
				savedState = getCookie(item, optionalData);
			} else {
				savedState = getCookie(item);
			}
			if (savedState !== null && savedState !== undefined) {
				let parsedState = JSON.parse(savedState);
				return parsedState;
			} else {
				return {};
			}
		}

	} catch (error) {
		console.warn("Error occurred while retrieving state. Error: " + error);
		return {};
	}
}

const saveStateAsyncStorage = (data, key = "appData") => {
	try {
		if (typeof window !== 'undefined') {
			localStorage.setItem(key, JSON.stringify(data));
			setCookie(key, JSON.stringify(data));
			return true;
		} else {
			setCookie(key, JSON.stringify(data));
			return true;
		}
	} catch (error) {
		console.warn("Error occurred while retrieving state. Error: " + error);
		return false;
	}
}

const timeStringToHumanDate = (totalSeconds) => {
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	// If you want strings with leading zeroes:
	minutes = String(minutes).padStart(2, "0");
	hours = String(hours).padStart(2, "0");
	seconds = String(seconds).padStart(2, "0");
	return hours + ":" + minutes + ":" + seconds;
}

const timeStringToMinutes = (totalSeconds) => {
	// totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	minutes = String(minutes).padStart(2, "0");
	return minutes;
}

const extractHTMLContent = (html) => {
	return html.replace(/<[^>]+>/g, '')
};

const getQueryVariable = (url, name) => {
	name = name.replace(/[\[\]]/g, '\\$&');
	let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const truncateString = (str, n) => {
	if (str) {
		return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
	} else {
		str
	}
};

const JSONToQueryString = (json) => {
	return Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' +
			encodeURIComponent(json[key]);
	}).join('&');
}

const queryStringToJSON = (qs) => {
	qs = qs;

	var pairs = qs.split('&');
	var result = {};
	pairs.forEach(function (p) {
		var pair = p.split('=');
		var key = pair[0];
		var value = decodeURIComponent(pair[1] || '');

		if (result[key]) {
			if (Object.prototype.toString.call(result[key]) === '[object Array]') {
				result[key].push(value);
			} else {
				result[key] = [result[key], value];
			}
		} else {
			result[key] = value;
		}
	});

	return JSON.parse(JSON.stringify(result));
};

const generateProductImage = (imageData) => {


	const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.productBanner}`

	let productBannerImage = '/img/default-image.png';

	if (imageData != null) {
		if (imageData.hasOwnProperty('product_images')) {
			if (imageData?.product_images.length > 0) {
				productBannerImage = imageData.product_images.filter(images => images.is_highlighted)
				productBannerImage = productBannerImage.length > 0 ? productBannerImage[0].file_name : imageData.product_images[0].file_name
				productBannerImage = BASE_URL + productBannerImage
			}
		} else {
			productBannerImage = '/img/default-image.png';
		}
	}

	return productBannerImage
}

const convertToSlug = (Text) => {
	return Text.toLowerCase()
		.replace(/ /g, '-')
		.replace(/-+/g, '-')
		.replace(/[^\w-]+/g, '');
}

const getLanguageLabel = (string) => {
	let displayString = string;
	if (string && string != null && string != "null" && string.trim() != '') {
		const defaultLanguage = global.defaultLanguage || 'Hindi';
		const languageLabelData = global.languageLabelData || [];
		if (languageLabelData && typeof languageLabelData == "object" && languageLabelData.length > 0) {

			let languageLabel = languageLabelData.filter(item => {
				return item.label.toLowerCase() == string.toLowerCase()
			})
			if (languageLabel.length > 0) {
				let translation = JSON.parse(languageLabel[0].translation)
				let translationData = translation.filter(translationItem => { return translationItem.language_code.toLowerCase() == defaultLanguage.toLowerCase() })
				if (translationData.length > 0) {
					displayString = translationData[0].language_label
				} else {
					displayString = string
				}
			} else {
				displayString = string
			}
		} else {
			displayString = string
		}
	}
	return displayString ? displayString.split(`${`\\` + 'n'}`).join("\n") : displayString
}

const convertToPriceFormat = (value) => {
	return "₹" + Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

const stripSlashes = (str) => {
	return (str + '').replace(/\\(.?)/g, function (s, n1) {
		switch (n1) {
			case '\\':
				return '\\';
			case '0':
				return '\u0000';
			case '':
				return '';
			default:
				return n1;
		}
	});
}

export {
	getStateAsyncStorage,
	saveStateAsyncStorage,
	timeStringToHumanDate,
	timeStringToMinutes,
	extractHTMLContent,
	getQueryVariable,
	truncateString,
	JSONToQueryString,
	queryStringToJSON,
	generateProductImage,
	convertToSlug,
	getLanguageLabel,
	convertToPriceFormat,
	stripSlashes
};

