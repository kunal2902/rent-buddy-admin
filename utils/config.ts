import { getCookie } from 'cookies-next';
import { ActionIconVariant, AvatarVariant, InputVariant, MantineColor, MantineRadius, MantineSize } from '@mantine/core';

/** Global variables */
export const isDebug: boolean = true;
export const appName: string = 'NCA CRM';
export const appTitle: string = 'NCA CRM';
export const appDescription: string = 'NCM ';
export const appLogoWidth: number = 40;
export const appLogoHeight: number = 40;

/** App colors */
export const appColor: string = '#6cd2d5';
export const appAccentColor: string = '#e88e7c';
export const whiteColor: string = '#ffffff';
export const blackColor: string = '#000000';

/** Mantine Variables */
export const appColorRGBA: MantineColor = 'rgba(108, 210, 213, 1)';
export const appAccentColorRGBA: MantineColor = 'rgba(232,142,124,1)';
export const mantineSize: MantineSize = 'md';
export const mantineButtonSize: MantineSize = 'sm';
export const mantineActionIconSize: MantineSize = 'lg';
export const mantineActionIconVariant: ActionIconVariant = 'light';
export const mantineRadius: MantineRadius = 'lg';
export const mantineInputVariant: InputVariant = 'filled';
export const mantineAvatarVariant: AvatarVariant = 'filled';
export const mantineSpaceHeight: MantineSize = 'sm';
export const mantineSpaceWidth: MantineSize = 'md';

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
export const loginAPIPath: string = `${apiUrl}auth/login`;

// Permission path
export const getPermissionsAPIPath: string = `${apiUrl}permission`;

// Tag path
/** get, post and put api path */
export const tagAPIPath: string = `${apiUrl}tag`;
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

/** Route Constants */
export const dashboardRoute: string = '/';
export const loginRoute: string = '/login';
export const customersRoute: string = '/customers';
export const posRoute: string = '/pos';
export const usersRoute: string = '/users';
export const reportsRoute: string = '/reports';
const inventoryRoute: string = '/inventory';
export const addOnsRoute: string = `${inventoryRoute}/add-ons`;
export const categoriesRoute: string = `${inventoryRoute}/categories`;
export const customAttributesRoute: string = `${inventoryRoute}/custom-attributes`;
export const itemTypesRoute: string = `${inventoryRoute}/item-types`;
export const itemsRoute: string = `${inventoryRoute}/items`;
export const subCategoriesRoute: string = `${inventoryRoute}/sub-categories`;
export const tagsRoute: string = `${inventoryRoute}/tags`;
const settingsRoute: string = '/settings';
export const aboutRoute: string = `${settingsRoute}/about`;
export const contactRoute: string = `${settingsRoute}/contact`;
export const emailRoute: string = `${settingsRoute}/email`;
export const generalSettingsRoute: string = `${settingsRoute}/general`;
export const pageLayoutRoute: string = `${settingsRoute}/page-layout`;
export const privacyPolicyRoute: string = `${settingsRoute}/privacy-policy`;
export const rolesRoute: string = `${settingsRoute}/roles`;
export const taxesRoute: string = `${settingsRoute}/taxes`;
export const tncRoute: string = `${settingsRoute}/tnc`;

/** Sidebar Constants */
export const dashboardName: string = 'Dashboard';
export const inventoryName: string = 'Inventory';
export const itemsName: string = 'Items';
export const itemTypesName: string = 'Item Types';
export const categoriesName: string = 'Categories';
export const subCategoriesName: string = 'Sub-Categories';
export const customAttributesName: string = 'Custom Attributes';
export const tagsName: string = 'Tags';
export const addOnsName: string = 'Add-ons';
export const customersName: string = 'Customers';
export const usersName: string = 'Users';
export const reportsName: string = 'Reports';
export const settingsName: string = 'Settings';
export const generalSettingsName: string = 'General Settings';
export const rolesName: string = 'Roles';
export const pageLayoutName: string = 'Page Layout';
export const pagesName: string = 'Pages';
export const aboutName: string = 'Pos';
export const contactName: string = 'Pos';
export const privacyPolicyName: string = 'Pos';
export const tncName: string = 'Pos';
export const emailSettingsName: string = 'Email Settings';
export const taxesName: string = 'Taxes';
