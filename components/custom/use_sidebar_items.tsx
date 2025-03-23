"use client";

import { useEffect, useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import { getCookie } from "cookies-next";
import {
	activityLogsName,
	categoriesName,
	customersName,
	isAdminAtom,
	itemsName,
	itemTypesName,
	reportsName,
	rolesName,
	settingsName,
	subCategoriesName,
	tagsName,
	usersName,
	inventoryName,
	addOnsName,
	customAttributesName, warrantyName
} from "@/utils";
import { SidebarItems, SideBarProps, SideBarType } from "@/constants";
import { checkPermissions } from "@/components/custom/check_permission_entities";

export const useSidebarItems = (): Array<SideBarProps<SideBarType>> => {
	const [isAdmin, setIsAdmin] = useRecoilState(isAdminAtom);
	const [sidebarItems, setSidebarItems] = useState<SideBarProps<SideBarType>[] | null>(null);

	const permissionsToCheck = useMemo(
		() => [
			{ key: "canViewTags", entity: "tag", permissions: ["view"] },
			{ key: "canViewLogs", entity: "logs", permissions: ["view"] },
			{ key: "canViewRoles", entity: "role", permissions: ["view"] },
			{ key: "canViewUsers", entity: "user", permissions: ["view"] },
			{ key: "canViewItems", entity: "item", permissions: ["view"] },
			{ key: "canViewAddOns", entity: "add-on", permissions: ["view"] },
			{ key: "canViewReports", entity: "reports", permissions: ["view"] },
			{ key: "canViewCustomers", entity: "customer", permissions: ["view"] },
			{ key: "canViewCategories", entity: "category", permissions: ["view"] },
			{ key: "canViewItemTypes", entity: "item-type", permissions: ["view"] },
			{ key: "canViewWarranties", entity: "warranties", permissions: ["view"] },
			{ key: "canViewSubCategories", entity: "sub-category", permissions: ["view"] },
			{ key: "canViewCustomAttributes", entity: "custom-attribute", permissions: ["view"] },
		],
		[]
	);

	const userPermissions = useMemo(() =>
		permissionsToCheck.reduce((acc, { key, entity, permissions }) => {
			acc[key] = checkPermissions(entity, permissions);
			return acc;
		}, {} as Record<string, boolean>), [permissionsToCheck]);

	useEffect(() => {
		const cookieValue = getCookie("is_admin");
		if (cookieValue) {
			setIsAdmin(JSON.parse(cookieValue as string));
		}
	}, [setIsAdmin]);

	useEffect(() => {
		if (isAdmin === null) return;

		const items = SidebarItems.filter((item) => {
			if (!isAdmin && [usersName, activityLogsName, settingsName].includes(item.title)) {
				return false;
			}

			const sidebarRestrictions: Record<string, boolean> = {
				[tagsName]: userPermissions.canViewTags,
				[rolesName]: userPermissions.canViewRoles,
				[itemsName]: userPermissions.canViewItems,
				[usersName]: userPermissions.canViewUsers,
				[addOnsName]: userPermissions.canViewAddOns,
				[reportsName]: userPermissions.canViewReports,
				[activityLogsName]: userPermissions.canViewLogs,
				[customersName]: userPermissions.canViewCustomers,
				[itemTypesName]: userPermissions.canViewItemTypes,
				[categoriesName]: userPermissions.canViewCategories,
				[subCategoriesName]: userPermissions.canViewSubCategories,
				[customAttributesName]: userPermissions.canViewCustomAttributes,
				[warrantyName]: userPermissions.canViewCustomAttributes,
			};

			if (item.title === inventoryName && item.type === SideBarType.Nested) {
				if ("options" in item.other) {
					item.other.options = item.other.options.filter(
						(subItem) => sidebarRestrictions[subItem.title] ?? true
					);

					return item.other.options.length > 0;
				}
			}

			return sidebarRestrictions[item.title] ?? true;
		});

		setSidebarItems(items);
	}, [isAdmin, userPermissions]);

	return sidebarItems ?? [];
};
