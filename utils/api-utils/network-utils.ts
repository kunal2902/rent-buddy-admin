import {
	getPermissionPath,
	getRolePath,
	getTagPath,
	isDebug,
	jwtToken,
	loginPath,
} from "../config/config";
import { toast } from "react-toastify";

const makeGetRequest = async (
	url: string | URL | Request,
	additionalHeaders = {}
) => {
	const rawResponse = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...additionalHeaders,
		},
	});
	return await rawResponse.json();
};

const makePostRequest = async (
	url: string | URL | Request,
	body: any,
	additionalHeaders = {}
) => {
	const rawResponse = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-localization": "en",
			...additionalHeaders,
		},
		body: JSON.stringify(body),
	});
	return await rawResponse.json();
};

// Login Api
export const login = async (
	email: string,
	password: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void
) => {
	const response = await makePostRequest(loginPath, {
		email: email,
		password: password,
	});

	if (isDebug) {
		console.log(response);
	}

	if (response.code === 200) {
		successCallback(response);
		toast.success(response.message);
	} else {
		errorCallback(response.error);
	}
};

// Permission Api
export const getPermission = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = jwtToken;
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(getPermissionPath, {
		authorization: "Bearer " + token,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.status) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Tag Api
export const getTag = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = jwtToken;
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(getTagPath, {
		authorization: "Bearer " + token,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.status) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Role Api
export const getRole = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = jwtToken;
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(getRolePath, {
		authorization: "Bearer " + token,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.status) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};
