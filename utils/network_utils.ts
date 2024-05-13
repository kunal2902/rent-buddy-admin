import { toast } from 'react-toastify';
import {
	getCrmJWT,
	isDebug,
	loginPath,
	getPermissionPath,
	tagPath,
	rolePath,
	attributePath,
	categoryPath,
	subCategoryPath,
	itemTypePath,
	addOnPath,
	itemPath,
	activityLogsPath,
	usersPath,
} from '@/utils';

const makeGetRequest = async (
	url: string | URL | Request,
	additionalHeaders = {}
) => {
	const rawResponse = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...additionalHeaders,
		},
	});
	return rawResponse.json();
};

const makeDeleteRequest = async (
	url: string | URL | Request,
	additionalHeaders = {}
) => {
	const rawResponse = await fetch(url, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...additionalHeaders,
		},
	});
	return rawResponse.json();
};

const makePostRequest = async (
	url: string | URL | Request,
	body: any,
	additionalHeaders = {}
) => {
	const rawResponse = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-localization': 'en',
			...additionalHeaders,
		},
		body: JSON.stringify(body),
	});
	return rawResponse.json();
};

const makePutRequest = async (
	url: string | URL | Request,
	body: any,
	additionalHeaders = {}
) => {
	const rawResponse = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'X-localization': 'en',
			...additionalHeaders,
		},
		body: JSON.stringify(body),
	});
	return rawResponse.json();
};

// Login Api
export const loginApi = async (
	email: string,
	password: string,
	successCallback: (arg0: any) => void,
	errorCallback: (arg0: any) => void
) => {
	const response = await makePostRequest(loginPath, {
		email,
		password,
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
export const getPermissionApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(getPermissionPath, {
		authorization: `Bearer ${token}`,
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
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Tag Api
export const getTagApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(tagPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const gettagByIdPathApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${tagPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertTagApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(tagPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableTagApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(tagPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteTagApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${tagPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Role Api
export const getRolesApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(rolePath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getroleByIdPathApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${rolePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertRoleApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(rolePath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableRoleApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${rolePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteRoleApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${rolePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// custom-attribute api
export const getAttributeApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(attributePath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getAttributeByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${attributePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertAttributeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(attributePath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableAttributeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${attributePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteAttributeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${attributePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// category api
export const getCategoryApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(categoryPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getcategoryByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${categoryPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(categoryPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableCategoryApi = async (
	id:string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${categoryPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${categoryPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Sub categery api
export const getSubCategoryApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(subCategoryPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getSubCategoryByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${subCategoryPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertSubCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(subCategoryPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableSubCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${subCategoryPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteSubCategoryApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${subCategoryPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Item type api
export const getItemTypeApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(itemTypePath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getItemTypeByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${itemTypePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertItemTypeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(itemTypePath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableItemTypeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${itemTypePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteItemTypeApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${itemTypePath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Item api
export const getItemApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(itemPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getItemByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${itemPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertItemApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(itemPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableItemApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${itemPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteItemApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${itemPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Add on api
export const getAddOnApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(addOnPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getAddOnByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${addOnPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const upsertAddOnApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(addOnPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const disableAddOnApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(`${addOnPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteAddOnApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(`${addOnPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Activity logs api
export const getActivityLogsApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(activityLogsPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getActivityLogsByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${activityLogsPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Users api
export const getUsersApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(usersPath, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getUsersByIdApi = async (
	id: string,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null || token === '' || token === 'null') {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(`${usersPath}/${id}`, {
		authorization: `Bearer ${token}`,
	});
	if (isDebug) {
		console.log(response);
	}
	switch (response.code) {
		case 200:
			successCallback(response.data);
			break;
		case 420:
		case 498:
		case 499:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};
