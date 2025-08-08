import { toast } from "react-toastify";
import {
	activityLogsAPIPath,
	addOnAPIPath,
	attributeAPIPath,
	cartAPIPath,
	cartItemAPIPath,
	categoryAPIPath, checkoutAPIPath,
	customerAPIPath,
	dashboardAPIPath,
	getCrmJWT,
	isDebug,
	itemAPIPath,
	itemTypeAPIPath,
	loginAPIPath,
	permissionAPIPath,
	reportsAPIPath,
	roleAPIPath,
	subCategoryAPIPath,
	tagAPIPath,
	usersAPIPath, warrantyAPIPath,
} from "@/utils";
import { CartItemModel, CartModel } from "@/models";

const makeGetRequest = async (
	url: string | URL | Request,
	additionalHeaders = {},
) => {
	const location = localStorage.getItem("selected_location");
	const urlString = url.toString();

	const separator = urlString.includes("?") ? "&" : "?";

	const finalUrl = `${urlString}${separator}location=${location}`;

	const rawResponse = await fetch(finalUrl, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...additionalHeaders,
		},
	});
	return rawResponse.json();
};

const makeDeleteRequest = async (
	url: string | URL | Request,
	additionalHeaders = {},
) => {
	const location = localStorage.getItem("selected_location");

	const rawResponse = await fetch(`${url}?location=${location}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...additionalHeaders,
		},
	});
	return rawResponse.json();
};

const makePostRequest = async (
	url: string | URL | Request,
	body: any,
	additionalHeaders = {},
	options: { skipLocation?: boolean } = {}
) => {
	const location = localStorage.getItem("selected_location");
	const isFormData = body instanceof FormData;

	const headers: { [key: string]: string } = {
		"X-localization": "en",
		...additionalHeaders,
	};

	if (!isFormData) {
		headers["Content-Type"] = "application/json";
	}

	// ✅ only add location if not skipped
	const finalUrl =
		!options.skipLocation && location
			? `${url}?location=${location}`
			: url.toString();

	const rawResponse = await fetch(finalUrl, {
		method: "POST",
		headers,
		body: isFormData ? body : JSON.stringify(body),
	});

	return rawResponse.json();
};

const makePutRequest = async (
	url: string | URL | Request,
	body:any,
	additionalHeaders = {},
) => {
	const location = localStorage.getItem("selected_location");

	const rawResponse = await fetch(`${url}?location=${location}`, {
		method: "PUT",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			"X-localization": "en",
			...additionalHeaders,
		},
	});
	return rawResponse.json();
};

// Login Api
export const loginApi = async (
	email: string,
	password: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
) => {
	const response = await makePostRequest(
		loginAPIPath,
		{ email, password },
		{},
		{ skipLocation: true }
	);

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

// Dashboard Api
export const getDashboardApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path =
		query === "" ? dashboardAPIPath : `${dashboardAPIPath}/${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Permission Api
export const getPermissionApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path =
		query === "" ? permissionAPIPath : `${permissionAPIPath}/${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Tag Api
export const getTagApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? tagAPIPath : `${tagAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getTagByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${tagAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertTagApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	const response = await makePostRequest(tagAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableTagApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${tagAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteTagApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${tagAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Role Api
export const getRoleApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? roleAPIPath : `${roleAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getRoleByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${roleAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertRoleApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(roleAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableRoleApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${roleAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteRoleApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${roleAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// custom-attribute api
export const getAttributeApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path =
		query === "" ? attributeAPIPath : `${attributeAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getAttributeByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${attributeAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertAttributeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(attributeAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableAttributeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${attributeAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteAttributeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${attributeAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// category api
export const getCategoryApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? categoryAPIPath : `${categoryAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getcategoryByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${categoryAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(categoryAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${categoryAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${categoryAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Sub category api
export const getSubCategoryApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path =
		query === "" ? subCategoryAPIPath : `${subCategoryAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getSubCategoryByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${subCategoryAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertSubCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(subCategoryAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableSubCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${subCategoryAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteSubCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${subCategoryAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Item type api
export const getItemTypeApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? itemTypeAPIPath : `${itemTypeAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getItemTypeByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${itemTypeAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertItemTypeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(itemTypeAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableItemTypeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${itemTypeAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteItemTypeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${itemTypeAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Item api
export const getItemApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? itemAPIPath : `${itemAPIPath}?${query}`;
	console.log("Making request to:", path);
	const response = await makeGetRequest(path, {
		Authorization: `Bearer ${token}`,
	});
	console.log("API Response:", response); // Debug log

	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getItemByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${itemAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertItemApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(itemAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const updateItemApi = async (
	id: string,
	updateData: any,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${itemAPIPath}/${id}`, updateData, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableItemApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	// Send empty body for disable functionality (controller will handle toggle)
	const response = await makePutRequest(`${itemAPIPath}/${id}`, {}, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteItemApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${itemAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Add on api
export const getAddOnApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? addOnAPIPath : `${addOnAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getAddOnByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${addOnAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertAddOnApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(addOnAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableAddOnApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${addOnAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteAddOnApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${addOnAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Activity logs api
export const getActivityLogsApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path =
		query === "" ? activityLogsAPIPath : `${activityLogsAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getActivityLogsByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${activityLogsAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Users api
export const getUsersApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? usersAPIPath : `${usersAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getUserByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${usersAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertUserApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(usersAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableUserApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${usersAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteUserApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${usersAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Customer api
export const getCustomerApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? customerAPIPath : `${customerAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getCustomerByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${customerAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertCustomerApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	const response = await makePostRequest(customerAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableCustomerApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${customerAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteCustomerApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${customerAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Cart api
export const upsertCartApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
): Promise<{ cart: CartModel } | string | undefined> => {
	const token = getCrmJWT();
	const response = await makePostRequest(cartAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}

	switch (response.code) {
		case 200:
			successCallback(response.data);
			return response.data as { cart: CartModel };
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
			throw new Error(response.message);

			return response.message;
	}

	return undefined;
};

export const cartDraftApi = async (
	id: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${cartAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteCartApi = async (
	id: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${cartAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getCartByIdApi = async (
	id: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${cartAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// Cart Item api
export const upsertCartItemApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
): Promise<
	| {
			cartItem: CartItemModel;
}
	| string
	| undefined
> => {
	const token = getCrmJWT();
	const response = await makePostRequest(cartItemAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);

			return response.data as {
				cartItem: CartItemModel;
			};
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
			throw new Error(response.message);
	}

	return undefined;
};

export const deleteCartItemApi = async (
	id: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
): Promise<boolean | string | undefined> => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return undefined;
	}
	const response = await makeDeleteRequest(`${cartItemAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);

			return true;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);

			throw new Error(response.message);
	}

	return undefined;
};

// Reports Api
export const getReportsAPI = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? reportsAPIPath : `${reportsAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const updateReportApi = async (
	id: string,
	updateData:any,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}

	// Pass the required headers including the token and Content-Type
	const headers = {
		authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	try {
		const response = await makePutRequest(`${reportsAPIPath}/${id}`, updateData, headers);

		if (isDebug) {
			console.log(response);
		}

		switch (response.code) {
			case 200:
				successCallback(response.data);
				break;
			case 403:
			case 420:
			case 498:
			case 499:
				logoutCallback();
				break;
			default:
				errorCallback(response.message);
				toast.error(response.message);
		}
	} catch (error) {
		errorCallback("An unexpected error occurred.");
		toast.error("An unexpected error occurred.");
	}
};

// Checkout Api
export const checkoutApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	const response = await makePostRequest(checkoutAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

// warranty api
export const getWarrantyApi = async (
	query: string | undefined,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const path = query === "" ? warrantyAPIPath : `${warrantyAPIPath}?${query}`;
	const response = await makeGetRequest(path, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const getWarrantyByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${warrantyAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const upsertWarrantyApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: (message: string) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(warrantyAPIPath, body, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const disableWarrantyApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${warrantyAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};

export const deleteWarrantyApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void,
	logoutCallback: () => void,
) => {
	const token = getCrmJWT();
	if (token === null || token === "" || token === "null") {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${warrantyAPIPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 403:
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback(response.message);
			toast.error(response.message);
	}
};
