import { getCookie } from "cookies-next";

export const checkPermissions = (entity: string, requiredPermissions: string[]) => {
	const permissionEntities = JSON.parse(
		decodeURIComponent(getCookie("permission_entities") || "[]")
	);
	console.log("permissionEntities", permissionEntities);

	const entityPermissions = permissionEntities.find(
		(permission: any) => permission.entity === entity
	)?.permissions;

	if (!entityPermissions) return false;

	return requiredPermissions.every((permission) =>
		entityPermissions.includes(permission)
	);
};
