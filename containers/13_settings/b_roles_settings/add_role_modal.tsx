"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	GroupComponent,
	ModalComponent,
	SpaceComponent,
	TextInputComponent,
	TitleComponent,
} from "@/components";
import { logoutUser, upsertRoleApi } from "@/utils";
import { StackComponent } from "@/components/mantine/stack_component";
import { PermissionModal } from "@/components/custom/permission_modal";
import { PermissionModel } from "@/models";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialRoleValue: string;
	roleId: string;
	rolePermissions: PermissionModel[];
}

const AddRoleModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialRoleValue,
		roleId,
		rolePermissions,
	} = props;
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [roleName, setRoleName] = useState<string>(initialRoleValue);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [inputError, setInputError] = useState<string | null>(null);
	const [selectedPermissions, setSelectedPermissions] = useState<PermissionModel[]>([]);
	const [totalPermissions, setTotalPermissions] = useState<PermissionModel[]>([]);
	const isEditModal: boolean = initialRoleValue !== "";

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
		console.log("Submitting role:", roleBody);
		setLoading(true);
		try {
			await upsertRoleApi(
				roleBody,
				() => {
					onClose();
					setCallApi(val => !val);
					setLoading(false);
				},
				(message: string) => {
					console.log(message);
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
			title={<TitleComponent title={isEditModal ? "Edit Role" : "New Role"} />}
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
				title="Select Permissions"
				onClick={() => setOpenModal(true)}
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
				rolePermissions={rolePermissions}
				setTotalPermissions={setTotalPermissions}
				setSelectedPermission={setSelectedPermissions}
			/>

		</ModalComponent>
	);
};

export default AddRoleModal;
