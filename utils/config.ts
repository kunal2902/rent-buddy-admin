import { getCookie } from 'cookies-next';
import { AvatarVariant, InputVariant, MantineColor, MantineRadius, MantineSize } from '@mantine/core';

/** Global variables */
export const isDebug: boolean = true;
export const appName: string = 'NCA CRM';
export const appTitle: string = 'NCA CRM';
export const appDescription: string = 'NCM ';

/** App colors */
export const appColor: string = '#6cd2d5';
export const appAccentColor: string = '#e88e7c';
export const whiteColor: string = '#ffffff';
export const blackColor: string = '#000000';

/** Mantine Variables */
export const appColorRGBA: MantineColor = 'rgba(108, 210, 213, 1)';
export const appAccentColorRGBA: MantineColor = 'rgba(232,142,124,1)';
export const mantineSize: MantineSize = 'lg';
export const mantineRadius: MantineRadius = 'xl';
export const mantineInputVariant: InputVariant = 'filled';
export const mantineAvatarVariant: AvatarVariant = 'filled';

/** Cookie constants */
export const cookieOptions = {
	secure: true,
};
export const crmJwtConstant: string = 'crm_jwt';
export const userIdConstant: string = 'user_id';
export const nameConstant: string = 'name';
export const emailConstant: string = 'email';
export const userNameConstant: string = 'username';
export const roleIdConstant: string = 'role_id';

/** API Constants */
export const apiUrl: string = 'http://localhost:8000/api/v1';
export const loginPath: string = `${apiUrl}/auth/login`;

// Permission path
export const getPermissionPath: string = `${apiUrl}/permission`;

// Tag path
/** get all tags based on filtter, sorting and search, add or insert */
export const tagPath: string = `${apiUrl}/tag`;

// Role path
/** get all roles based on filtter, sorting and search, add or insert */
export const rolePath: string = `${apiUrl}/role`;

// Custom Attributes path
/** get all attributes based on filtter, sorting and search, add or insert */
export const attributePath: string = `${apiUrl}/attribute`;

// Category path
/** get all Category based on filtter, sorting and search, add or insert */
export const categoryPath: string = `${apiUrl}/category`;

// Sub category api path
/** get all Sub category based on filtter, sorting and search, add or insert */
export const subCategoryPath: string = `${apiUrl}/sub-category`;

// Item type path
/** get all Item Type based on filtter, sorting and search, add or insert */
export const itemTypePath: string = `${apiUrl}/item-type`;

// Item path
/** get all Item Type based on filtter, sorting and search, add or insert */
export const itemPath: string = `${apiUrl}/item`;

// Add-on path
/** get all add on based on filtter, sorting and search, add or insert */
export const addOnPath: string = `${apiUrl}/add-on`;

// Activity logs path
/** get all add on based on filtter, sorting and search, add or insert */
export const activityLogsPath: string = `${apiUrl}/activity-logs`;

// Activity logs path
/** get all add on based on filtter, sorting and search, add or insert */
export const usersPath: string = `${apiUrl}/users`;

/** Constant Functions */
/** To get the CRM JWT stored in Cookies */
export const getCrmJWT = (): string => getCookie(crmJwtConstant) ?? '';
/** To get the User id stored in Cookies */
export const getUserId = (): string => getCookie(userIdConstant) ?? '';
/** To get the name stored in Cookies */
export const getName = (): string => getCookie(nameConstant) ?? '';
/** To get the Email stored in Cookies */
export const getEmail = (): string => getCookie(emailConstant) ?? '';
/** To get the Username stored in Cookies */
export const getUserName = (): string => getCookie(userNameConstant) ?? '';
/** To get the Role id stored in Cookies */
export const getRoleId = (): string => getCookie(roleIdConstant) ?? '';
