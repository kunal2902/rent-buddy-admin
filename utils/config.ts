import { getCookie } from "cookies-next";
import {
	ActionIconVariant,
	AvatarVariant,
	InputVariant,
	MantineColor,
	MantineRadius,
	MantineSize,
} from "@mantine/core";

/** Global variables */
export const isDebug: boolean = false;
export const appName: string = "NCA CRM";
export const appTitle: string = "NCA CRM";
export const appDescription: string = "NCM ";
export const appLogoWidth: number = 40;
export const appLogoHeight: number = 40;
export const currencySign: string = "₹";

/** App colors */
export const appColor: string = "#7469B6";
export const appAccentColor: string = "#EE4266";
export const whiteColor: string = "#ffffff";
export const blackColor: string = "#000000";

/** Mantine Variables */
export const appColorRGBA: MantineColor = "rgba(116, 105, 182, 1)";
export const appAccentColorRGBA: MantineColor = "rgba(238,66,102,1)";
export const mantineSize: MantineSize = "md";
export const mantineChipSize: MantineSize = "sm";
export const mantineButtonSize: MantineSize = "sm";
export const mantineActionIconSize: MantineSize = "lg";
export const mantineActionIconVariant: ActionIconVariant = "light";
export const mantineRadius: MantineRadius = "md";
export const mantineInputVariant: InputVariant = "default";
export const mantineAvatarVariant: AvatarVariant = "filled";
export const mantineSpaceHeight: MantineSize = "sm";
export const mantineSpaceWidth: MantineSize = "sm";
export const mantineNavLinkChildOffset: MantineSize = "md";
export const mantineLargeModalWidth: MantineSize = "lg";
export const mantineMediumModalWidth: MantineSize = "md";

/** Cookie constants */
export const cookieOptions = {
	secure: true,
};
export const crmJwtConstant: string = "crm_jwt";
export const userIdConstant: string = "user_id";
export const nameConstant: string = "name";
export const emailConstant: string = "email";
export const userNameConstant: string = "username";
export const roleIdConstant: string = "role_id";
export const sidebarStateConstant: string = "sidebar_state";

/** API Constants */
export const apiUrl: string = process.env.NODE_ENV === "production" ?
	"https://localhost:8000/api/v1" :
	"http://localhost:8000/api/v1";
export const loginAPIPath: string = `${apiUrl}/auth/login`;

// Permission path
export const permissionAPIPath: string = `${apiUrl}/permission`;

// Tag path
/** get all tags based on filter, sorting and search, add or insert */
export const tagAPIPath: string = `${apiUrl}/tag`;

// Role path
/** get all roles based on filter, sorting and search, add or insert */
export const roleAPIPath: string = `${apiUrl}/role`;

// Custom Attributes path
/** get all attributes based on filter, sorting and search, add or insert */
export const attributeAPIPath: string = `${apiUrl}/custom-attribute`;

// Category path
/** get all Category based on filter, sorting and search, add or insert */
export const categoryAPIPath: string = `${apiUrl}/category`;

// Sub category api path
/** get all Sub category based on filter, sorting and search, add or insert */
export const subCategoryAPIPath: string = `${apiUrl}/sub-category`;

// Item type path
/** get all Item Type based on filter, sorting and search, add or insert */
export const itemTypeAPIPath: string = `${apiUrl}/item-type`;

// Item path
/** get all Item Type based on filter, sorting and search, add or insert */
export const itemAPIPath: string = `${apiUrl}/item`;

// Add-on path
/** get all add on based on filter, sorting and search, add or insert */
export const addOnAPIPath: string = `${apiUrl}/add-on`;

// Activity logs path
/** get all add on based on filter, sorting and search, add or insert */
export const activityLogsAPIPath: string = `${apiUrl}/activity-logs`;

// Users path
/** get all add on based on filter, sorting and search, add or insert */
export const usersAPIPath: string = `${apiUrl}/users`;

// Users path
/** get all add on based on filter, sorting and search, add or insert */
export const customerAPIPath: string = `${apiUrl}/customer`;

/** Constant Functions */
/** To get the CRM JWT stored in Cookies */
export const getCrmJWT = (): string => getCookie(crmJwtConstant) ?? "";
/** To get the User id stored in Cookies */
export const getUserId = (): string => getCookie(userIdConstant) ?? "";
/** To get the name stored in Cookies */
export const getName = (): string => getCookie(nameConstant) ?? "";
/** To get the Email stored in Cookies */
export const getEmail = (): string => getCookie(emailConstant) ?? "";
/** To get the Username stored in Cookies */
export const getUserName = (): string => getCookie(userNameConstant) ?? "";
/** To get the Role id stored in Cookies */
export const getRoleId = (): string => getCookie(roleIdConstant) ?? "";
/** To get the Sidebar state stored in Cookies */
export const getSidebarState = (): string =>
	getCookie(sidebarStateConstant) ?? "true";

/** Route Constants */
export const dashboardRoute: string = "/";
export const loginRoute: string = "/login";
export const customersRoute: string = "/customers";
export const posRoute: string = "/pos";
export const usersRoute: string = "/users";
export const reportsRoute: string = "/reports";
const inventoryRoute: string = "/inventory";
export const addOnsRoute: string = `${inventoryRoute}/add-ons`;
export const categoriesRoute: string = `${inventoryRoute}/categories`;
export const customAttributesRoute: string = `${inventoryRoute}/custom-attributes`;
export const itemTypesRoute: string = `${inventoryRoute}/item-types`;
export const itemsRoute: string = `${inventoryRoute}/items`;
export const subCategoriesRoute: string = `${inventoryRoute}/sub-categories`;
export const tagsRoute: string = `${inventoryRoute}/tags`;
const settingsRoute: string = "/settings";
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
export const dashboardName: string = "Dashboard";
export const inventoryName: string = "Inventory";
export const itemsName: string = "Items";
export const itemTypesName: string = "Item Types";
export const categoriesName: string = "Categories";
export const subCategoriesName: string = "Sub-Categories";
export const customAttributesName: string = "Custom Attributes";
export const tagsName: string = "Tags";
export const addOnsName: string = "Add-ons";
export const customersName: string = "Customers";
export const usersName: string = "Users";
export const reportsName: string = "Reports";
export const settingsName: string = "Settings";
export const generalSettingsName: string = "General Settings";
export const rolesName: string = "Roles";
export const pageLayoutName: string = "Page Layout";
export const pagesName: string = "Pages";
export const aboutName: string = "About";
export const contactName: string = "Contact";
export const privacyPolicyName: string = "Privacy Policy";
export const tncName: string = "Terms & Conditions";
export const emailSettingsName: string = "Email Settings";
export const taxesName: string = "Taxes";

// Date format function
export const formatDate = (inputDate: any) => {
	const date = new Date(inputDate);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}/${month}/${year} ${hours}:${minutes}`;
};
