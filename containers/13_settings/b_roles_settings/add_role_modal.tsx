"use client";

import { toast } from "react-toastify";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, SpaceComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import { upsertRoleApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialRoleValue: string;
	roleId: string;
}

const AddRoleModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialRoleValue, roleId } = props;
	const [roleName, setRoleName] = useState<string>(initialRoleValue);
	const [inputError, setInputError] = useState<string | null>(null);
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
		const body = {
			name: roleName,
			id: roleId,
		};
		try {
			await upsertRoleApi(
				body,
				() => {
					onClose();
					setCallApi(true);
				},
				(message: string) => {
					toast.error(message);
				},
				() => {},
			);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			title={<TitleComponent title={isEditModal ? "Edit Role" : "New Role"} />}
		>
			<TextInputComponent
				required
				title="Name"
				label="Role Name"
				value={roleName}
				error={inputError}
				setValue={setRoleName}
				placeholder="Enter role Name"
			/>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitRole}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddRoleModal;
