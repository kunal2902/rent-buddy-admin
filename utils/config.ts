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
/** get all tags based on filtter, sorting and search */
export const tagsPath: string = `${apiUrl}/tags`;
/** add or insert tag route */
export const upsertTagPath: string = `${apiUrl}/upsert-tag`;
/** enable/disable tag, get tag by id and delete tag*/
export const tagByIdPath: string = `${apiUrl}/tag/:id`;

// Role path
/** get all roles based on filtter, sorting and search */
export const rolesPath: string = `${apiUrl}/roles`;
/** add or insert role route */
export const upsertRolePath: string = `${apiUrl}/upsert-role`;
/** enable/disable role, get role by id and delete role*/
export const roleByIdPath: string = `${apiUrl}/role/:id`;

// Custom Attributes path
/** get all attributes based on filtter, sorting and search */
export const attributesPath: string = `${apiUrl}/attributes`;
/** add or insert attribute route */
export const upsertAttributePath: string = `${apiUrl}/upsert-attribute`;
/** enable/disable attribute, get attribute by id and delete attribute*/
export const attributeByIdPath: string = `${apiUrl}/attribute/:id`;

// Category path
/** get all Categories based on filtter, sorting and search */
export const categoriesPath: string = `${apiUrl}/categories`;
/** add or insert Category route */
export const upsertCategoryPath: string = `${apiUrl}/upsert-category`;
/** enable/disable category, get category by id and delete category*/
export const categoryByIdPath: string = `${apiUrl}/category/:id`;

// Sub category api path
/** get all Sub categories based on filtter, sorting and search */
export const subCategoriesPath: string = `${apiUrl}/sub-categories`;
/** add or insert Sub category route */
export const upsertSubCategoryPath: string = `${apiUrl}/upsert-sub-category`;
/** enable/disable Sub category, get Sub category by id and delete Sub category*/
export const subCategoryByIdPath: string = `${apiUrl}/sub-category/:id`;

// Item type path
/** get all Item Type based on filtter, sorting and search */
export const itemTypesPath: string = `${apiUrl}/item-types`;
/** add or insert item type route */
export const upsertItemTypePath: string = `${apiUrl}/upsert-item-type`;
/** enable/disable item type, get item type by id and delete item type*/
export const itemTypeByIdPath: string = `${apiUrl}/item-type/:id`;

// Add-on path
/** get all add on based on filtter, sorting and search */
export const addOnsPath: string = `${apiUrl}/add-Ons`;
/** add or insert Add On route */
export const upsertAddOnPath: string = `${apiUrl}/upsert-add-on`;
/** enable/disable add on, get add on by id and delete add on*/
export const addOnByIdPath: string = `${apiUrl}/add-on/:id`;

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
