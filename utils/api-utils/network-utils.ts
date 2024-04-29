import { isDebug, loginPath } from "../config/config";
import { toast } from "react-toastify";

// const makeGetRequest = async (
// 	url: string | URL | Request,
// 	additionalHeaders = {}
// ) => {
// 	const rawResponse = await fetch(url, {
// 		method: "GET",
// 		headers: {
// 			Accept: "application/json",
// 			"Content-Type": "application/json",
// 			...additionalHeaders,
// 		},
// 	});
// 	return await rawResponse.json();
// };

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
	sucessCallback: (arg0: any) => void,
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
		sucessCallback(response);
		toast.success(response.message);
	} else {
		errorCallback(response.error);
	}
};

// Permission Api
// export const getPermission = async (body, sucessCallback, errorCallback, logoutCallback) => {
//     const token ='';
//     if(token === null || tolem === '' ||)
// }
