import { getCookie } from "cookies-next";

// Global variables
export const isDebug = true;
export const crm_jwt = "crm_jwt";
export const jwtToken = getCookie(`${crm_jwt}`, {
	secure: true,
});

// Api config
export const apiUrl = "http://localhost:8000/api/v1/";
export const loginPath = `${apiUrl}auth/login`;

// Permission path
export const getPermissionPath = `${apiUrl}permission`;

// Tag path
export const getTagPath = `${apiUrl}tag`;

// Role path
export const getRolePath = `${apiUrl}role`;
