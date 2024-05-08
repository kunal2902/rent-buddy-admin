import { toast } from 'react-toastify';
import {
	createRolePath,
	deleteRolePath,
	getCrmJWT,
	getPermissionPath,
	tagPath,
	isDebug,
	loginPath,
	restoreTagPath,
	updateRolePath,
	attributePath,
	restoreAttributePath,
	attributeByIdPath,
	tagByIdPath,
	categoryByIdPath,
	categoryPath,
	itemTypeByIdPath,
	itemTypePath,
	subCategoryPath,
	subCategoryByIdPath,
	addOnPath,
	addOnByIdPath,
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
	if (token === null) {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Tag Api
export const getTagsApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

/** post and put api function */
export const tagApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getTagApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteTagByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(tagByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const restoreTagApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(restoreTagPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getTagByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(tagByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const enableDisableTagByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(tagByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Role Api
export const createRoleApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(createRolePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteRoleApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(deleteRolePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const updateRoleApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(updateRolePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getRoleApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(updateRolePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// custom-attribute api
export const getAttributeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(attributePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const postAttributeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(attributePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const restoreAttributeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(restoreAttributePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const enableDisableAttributebyIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(attributeByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getAttributebyIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(attributeByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteAttributebyIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(attributeByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// category api
export const postCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(categoryPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(categoryPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getCategoryByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(categoryByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteCategoryByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(categoryByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const updateCategoryByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(categoryByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Item type api
export const getItemTypeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(itemTypePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const postItemTypeApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(itemTypePath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getItemTypeByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(itemTypeByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteItemTypeByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(itemTypeByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const updateItemTypeByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(itemTypeByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Sub categery api
export const getSubCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(subCategoryPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const postSubCategoryApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(subCategoryPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const updateSubCategoryByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(subCategoryByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteSubCategoryByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(subCategoryByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getSubCategoryByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(subCategoryByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

// Sub categery api
export const getAddOnApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(addOnPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const postAddOnApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePostRequest(addOnPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const updateAddOnByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(addOnByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const deleteAddOnByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(addOnByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};

export const getAddOnByIdApi = async (
	body: any,
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(addOnByIdPath, {
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
		case 491:
			logoutCallback();
			break;
		default:
			errorCallback();
			toast.error(response.message);
	}
};
