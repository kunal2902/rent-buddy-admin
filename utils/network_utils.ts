import { toast } from 'react-toastify';
import {
	getCrmJWT,
	isDebug,
	loginPath,
	getPermissionPath,
	tagsPath,
	tagByIdPath,
	upsertTagPath,
	rolesPath,
	roleByIdPath,
	upsertRolePath,
	attributesPath,
	attributeByIdPath,
	upsertAttributePath,
	categoriesPath,
	categoryByIdPath,
	upsertCategoryPath,
	subCategoriesPath,
	subCategoryByIdPath,
	upsertSubCategoryPath,
	itemTypesPath,
	itemTypeByIdPath,
	upsertItemTypePath,
	addOnsPath,
	addOnByIdPath,
	upsertAddOnPath,
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
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(tagsPath, {
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

export const gettagByIdPathApi = async (
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

export const upsertTagApi = async (
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
	const response = await makePostRequest(upsertTagPath, {
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

export const disableTagApi = async (
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

export const deleteTagApi = async (
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

// Role Api
export const getRolesApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(rolesPath, {
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

export const getroleByIdPathApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(roleByIdPath, {
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

export const upsertRoleApi = async (
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
	const response = await makePostRequest(upsertRolePath, {
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

export const disableRoleApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makePutRequest(roleByIdPath, {
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

export const deleteRoleApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeDeleteRequest(roleByIdPath, {
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

// custom-attribute api
export const getAttributesApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(attributesPath, {
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

export const getAttributeByIdApi = async (
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

export const upsertAttributeApi = async (
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
	const response = await makePostRequest(upsertAttributePath, {
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

export const disableAttributeApi = async (
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

export const deleteAttributeApi = async (
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

// category api
export const getCategoriesApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(categoriesPath, {
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

export const getcategoryByIdApi = async (
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

export const upsertCategoryApi = async (
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
	const response = await makePostRequest(upsertCategoryPath, {
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

export const disableCategoryApi = async (
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

export const deleteCategoryApi = async (
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

// Sub categery api
export const getSubCategoriesApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(subCategoriesPath, {
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

export const getSubCategoryByIdApi = async (
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

export const upsertSubCategoryApi = async (
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
	const response = await makePostRequest(upsertSubCategoryPath, {
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

export const disableSubCategoryApi = async (
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

export const deleteSubCategoryApi = async (
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

// Item type api
export const getItemTypesApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(itemTypesPath, {
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

export const getItemTypeByIdApi = async (
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

export const upsertItemTypeApi = async (
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
	const response = await makePostRequest(upsertItemTypePath, {
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

export const disableItemTypeApi = async (
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

export const deleteItemTypeApi = async (
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

// Add on api
export const getAddOnsApi = async (
	successCallback: (arg0: any) => void,
	errorCallback: () => void,
	logoutCallback: () => void
) => {
	const token = getCrmJWT();
	if (token === null) {
		logoutCallback();
		return;
	}
	const response = await makeGetRequest(addOnsPath, {
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

export const getAddOnByIdApi = async (
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

export const upsertAddOnApi = async (
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
	const response = await makePostRequest(upsertAddOnPath, {
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

export const disableAddOnApi = async (
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

export const deleteAddOnApi = async (
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
