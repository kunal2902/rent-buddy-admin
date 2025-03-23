import { deleteCookie, getCookie } from "cookies-next";
import {
	ActionIconVariant,
	AvatarVariant,
	InputVariant,
	MantineColor,
	MantineRadius,
	MantineSize,
} from "@mantine/core";
import moment from "moment";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/** Global variables */
export const isDebug: boolean = false;
export const isProduction: boolean = false;
export const appName: string = "NCA CRM";
export const appTitle: string = "NCA CRM";
export const appDescription: string = "NCM ";
export const appLogoWidth: number = 40;
export const appLogoHeight: number = 40;
export const currencySign: string = "$";

/** App colors */
export const appColor: string = "#7469B6";
export const appAccentColor: string = "#EE4266";
export const whiteColor: string = "#ffffff";
export const blackColor: string = "#000000";
export const backgroundColorLight: string = "#efefef";
export const backgroundColorDark: string = "#333";
export const surfaceColorLight: string = "#fff";
export const surfaceColorDark: string = "#222";
export const backgroundColorTailwind: string = "bg-[#e0e0e0] dark:bg-[#333333]";
export const surfaceColorTailwind: string = "bg-[#ff0000] dark:bg-[#000000]";
export const textColorPrimaryLight: string = "#000";
export const textColorPrimaryDark: string = "#fff";
export const textColorSecondaryLight: string = "#e0e0e0";
export const textColorSecondaryDark: string = "#222";
export const commonColor: string = "#777";

/** Mantine Variables */
export const mantineH2Size: number = 18;
export const appColorRGBA: MantineColor = "rgba(116, 105, 182, 1)";
export const appAccentColorRGBA: MantineColor = "rgba(238,66,102,1)";
export const mantineSize: MantineSize = "md";
export const mantineButtonHeight: number = 36;
export const mantineChipSize: MantineSize = "sm";
export const mantineRadius: MantineRadius = "md";
export const mantineButtonSize: MantineSize = "sm";
export const mantineButtonLoaderSize: MantineSize = "xs";
export const mantineSpaceWidth: MantineSize = "sm";
export const mantineSpaceHeight: MantineSize = "sm";
export const mantineActionIconSize: MantineSize = "lg";
export const mantineLargeModalWidth: MantineSize = "lg";
export const mantineMediumModalWidth: MantineSize = "md";
export const mantineNavLinkChildOffset: MantineSize = "md";
export const mantineInputVariant: InputVariant = "filled";
export const mantineAvatarVariant: AvatarVariant = "filled";
export const mantineActionIconVariant: ActionIconVariant = "light";

/** Cookie constants */
export const cookieOptions = { secure: true };
export const crmJwtConstant: string = "crm_jwt";
export const userIdConstant: string = "user_id";
export const nameConstant: string = "name";
export const emailConstant: string = "email";
export const userNameConstant: string = "username";
export const roleIdConstant: string = "role_id";
export const isAdminConstant: string = "is_admin";
export const permissionEntityConstant: string = "permission_entities";
export const sidebarStateConstant: string = "sidebar_state";
export const themeModeConstant: string = "theme_mode";

/** API Constants */
export const apiUrl: string =
	process.env.NEXT_PUBLIC_API_URL ??
	(process.env.NODE_ENV === "production" || isProduction
		? "https://nca-api.unlockvelocity.in/api/v1"
		: "http://localhost:8000/api/v1");
export const loginAPIPath: string = `${apiUrl}/auth/login`;

// Dashboard path
export const dashboardAPIPath: string = `${apiUrl}/dashboard/summary-count`;

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
/** get all Item Types based on filter, sorting and search, add or insert */
export const itemTypeAPIPath: string = `${apiUrl}/item-type`;

// Item path
/** get all Items based on filter, sorting and search, add or insert */
export const itemAPIPath: string = `${apiUrl}/item`;

// Add-on path
/** get all add-ons based on filter, sorting and search, add or insert */
export const addOnAPIPath: string = `${apiUrl}/add-on`;

// Activity logs path
/** get all activity logs based on filter, sorting and search, add or insert */
export const activityLogsAPIPath: string = `${apiUrl}/activity-logs`;

// Users path
/** get all users based on filter, sorting and search, add or insert */
export const usersAPIPath: string = `${apiUrl}/user`;

// Customers path
/** get all customers based on filter, sorting and search, add or insert */
export const customerAPIPath: string = `${apiUrl}/customers`;

// Reports path
/** get all reports based on filter, sorting and search */
export const reportsAPIPath: string = `${apiUrl}/report`;

// Cart path
export const cartAPIPath: string = `${apiUrl}/cart`;

// Cart item path
export const cartItemAPIPath: string = `${apiUrl}/cart-item`;

// Checkout path
export const checkoutAPIPath: string = `${apiUrl}/checkout`;

// Warranty path
export const warrantyAPIPath: string = `${apiUrl}/warranty`;

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
/** To get the Sidebar state stored in Cookies */
export const getDarkMode = (): string => getCookie(themeModeConstant) ?? "none";

/** Route Constants */
export const dashboardRoute: string = "/";
export const loginRoute: string = "/login";
export const customersRoute: string = "/customers";
export const posRoute: string = "/pos";
export const usersRoute: string = "/users";
export const reportsRoute: string = "/reports";
export const activityLogsRoute: string = "/logs";
const inventoryRoute: string = "/inventory";
export const addOnsRoute: string = `${inventoryRoute}/add-ons`;
export const warrantyRoute: string = `${inventoryRoute}/warranties`;
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
export const warrantyName: string = "Warranty";
export const customersName: string = "Customers";
export const usersName: string = "Users";
export const reportsName: string = "Reports";
export const activityLogsName: string = "Activity Logs";
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

/** To format date according to the respective output */
export const formatDate = (inputDate: any) =>
	moment(inputDate).format("DD/MM/YYYY hh:mm a");

/** Converts passed string to Title case */
export const toTitleCase = (str: string) =>
	str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
	);

/** Returns Background Color for Surface */
export const getBackgroundColor = (darkMode: boolean) => ({
	backgroundColor: darkMode ? backgroundColorDark : backgroundColorLight,
});

/** Returns Surface Color for Surface */
export const getSurfaceColor = (darkMode: boolean) => ({
	backgroundColor: darkMode ? surfaceColorDark : surfaceColorLight,
});

/** Function to log-out user */
export const logoutUser = (router: AppRouterInstance) => {
	deleteCookie(crmJwtConstant, cookieOptions);
	deleteCookie(userIdConstant, cookieOptions);
	deleteCookie(nameConstant, cookieOptions);
	deleteCookie(emailConstant, cookieOptions);
	deleteCookie(userNameConstant, cookieOptions);
	deleteCookie(roleIdConstant, cookieOptions);
	deleteCookie(sidebarStateConstant, cookieOptions);
	deleteCookie(themeModeConstant, cookieOptions);
	deleteCookie(permissionEntityConstant, cookieOptions);
	deleteCookie(isAdminConstant, cookieOptions);
	router.replace("/");
};

export const paymentOptions = [
	{ id: "1", value: "Cash", label: "Cash" },
	{ id: "2", value: "Debit", label: "Debit" },
	{ id: "3", value: "Visa", label: "Visa" },
	{ id: "4", value: "Master Card", label: "Master Card" },
	{ id: "5", value: "Amex", label: "Amex" },
	{ id: "6", value: "Cheque", label: "Cheque" },
];
