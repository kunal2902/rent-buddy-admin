/** Global variables */
export const appName = "NCA CRM";
export const appColor = "#6cd2d5";
export const appAccentColor = "#e88e7c";
export const whiteColor = "#ffffff";
export const blackColor = "#000000";
export const appColorCSS = "bg-[#6cd2d5]";
export const appAccentColorCSS = "bg-[#e88e7c]";

export const isDebug = true;

/** String constants */
export const crmJwtConstant = "crm_jwt";
export const userIdConstant = "user_id";
export const nameConstant = "name";
export const emailConstant = "email";
export const userNameConstant = "username";
export const roleIdConstant = "role_id";

/** API Constants */
export const apiUrl = "http://localhost:8000/api/v1/";
export const loginPath = `${apiUrl}auth/login`;

// Permission path
export const getPermissionPath = `${apiUrl}permission`;

// Tag path
export const getTagPath = `${apiUrl}tag`;

// Role path
export const getRolePath = `${apiUrl}role`;
