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
export const apiUrl: string = 'http://localhost:8000/api/v1/';
export const loginPath: string = `${apiUrl}auth/login`;

// Permission path
export const getPermissionPath: string = `${apiUrl}permission`;

// Tag path
/** get, post and put api path */
export const tagPath: string = `${apiUrl}tag`;
/** restore api path */
export const restoreTagPath: string = `${apiUrl}tag/restore/:id`;
/** enable / disable, delete, get api path */
export const tagByIdPath: string = `${apiUrl}tag/:id`;

// Role path
/** post and get api path */
export const createRolePath: string = `${apiUrl}role`;
/**delete api path */
export const deleteRolePath: string = `${apiUrl}role/delete/:id`;
export const updateRolePath: string = `${apiUrl}role/:id`;

// Custom Attributes path
/** post and get api path */
export const attributePath: string = `${apiUrl}custom-attribute`;
/** restore api path */
export const restoreAttributePath: string = `${apiUrl}custom-attribute/restore/:id`;
/** enable / disable, get and delete api path */
export const attributeByIdPath: string = `${apiUrl}custom-attribute/:id`;

// Category path
/**post and get api path */
export const categoryPath: string = `${apiUrl}category`;
/** put, delete and get by id path */
export const categoryByIdPath: string = `${apiUrl}category/:id`;

// Sub category api path
/** get and post api path */
export const subCategoryPath: string = `${apiUrl}sub-category`;
/** get, put and delete path */
export const subCategoryByIdPath: string = `${apiUrl}sub-category/:id`;

// Item type path
/**post and get api path */
export const itemTypePath: string = `${apiUrl}item-type`;
/** get, put and delete path */
export const itemTypeByIdPath: string = `${apiUrl}item-type/:id`;

// Add-on path
/** post and get api path */
export const addOnPath: string = `${apiUrl}add-on`;
/** get, put and delete path */
export const addOnByIdPath: string = `${apiUrl}add-on/:id`;

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
