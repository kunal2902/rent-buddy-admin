"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SpaceComponent,
	TextInputComponent,
} from "@/components";
import { logoutUser, upsertRoleApi } from "@/utils";
import { StackComponent } from "@/components/mantine/stack_component";
import { PermissionModal } from "@/components/custom/permission_modal";
import { PermissionModel } from "@/models";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	roleId: string;
	isOpen: boolean;
	onClose: () => void;
	initialRoleName: string;
	initialSelectedPermissions: PermissionModel[];
	setCallApi: Dispatch<SetStateAction<boolean>>;
}

const AddRoleModal = (props: Props) => {
	const {
		onClose,
		isOpen,
		roleId,
		setCallApi,
		initialRoleName,
		initialSelectedPermissions,
	} = props;
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [roleName, setRoleName] = useState<string>(initialRoleName);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [inputError, setInputError] = useState<string | null>(null);
	const [selectedPermissions, setSelectedPermissions] =
		useState<PermissionModel[]>(initialSelectedPermissions);
	const [totalPermissions, setTotalPermissions] = useState<PermissionModel[]>([]);
	const isEditModal: boolean = initialRoleName !== "";

	useEffect(() => {
		if (roleName) {
			setInputError(null);
		}
	}, [roleName]);

	const handleSubmitRole = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!roleName) {
			setInputError("Please enter the name first");
		}
		let roleBody: {};
		const tempPerm: PermissionModel[] = [];
		for (let i = 0; i < selectedPermissions.length; i += 1) {
			const model = selectedPermissions[i];
			model.permissions = model.permissions.filter(n => n);
			if (model.permissions.some(val => val != null && val !== "")) {
				tempPerm.push(model);
			}
		}

		if (isAdmin) {
			roleBody = {
				id: roleId,
				name: roleName,
				isAdmin,
				permission_entities: totalPermissions,
			};
		} else {
			roleBody = {
				id: roleId,
				name: roleName,
				isAdmin,
				permission_entities: tempPerm,
			};
		}

		setLoading(true);
		try {
			await upsertRoleApi(
				roleBody,
				() => {
					onClose();
					setCallApi(val => !val);
					setLoading(false);
					ShowNotification("Successfully", "success");
				},
				(message: any) => {
					ShowNotification(message.error, "error");
					setLoading(false);
				},
				() => logoutUser(router)
			);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			closeOnEscape={false}
			title={isEditModal ? "Edit Role" : "New Role"}
		>
			<StackComponent>
				<TextInputComponent
					required
					title="Name"
					label="Role Name"
					value={roleName}
					error={inputError}
					setValue={setRoleName}
					placeholder="Enter role Name"
				/>
			</StackComponent>

			<SpaceComponent showHeight />

			<ButtonComponent
				px={10}
				fullWidth
				variant="light"
				onClick={() => setOpenModal(true)}
				title={initialSelectedPermissions.length > 0 ? "Change Permissions" : "Select Permissions"}
			/>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					loading={loading}
					title="Save"
					w={100}
					onClick={handleSubmitRole}
				/>
			</GroupComponent>

			<PermissionModal
				openModal={openModal}
				setIsAdmin={setIsAdmin}
				setOpenModal={setOpenModal}
				setTotalPermissions={setTotalPermissions}
				setSelectedPermission={setSelectedPermissions}
				initialSelectedPermissions={selectedPermissions}
			/>

		</ModalComponent>
	);
};

export default AddRoleModal;
