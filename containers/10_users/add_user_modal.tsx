"use client";

import { toast } from "react-toastify";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, SpaceComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import { upsertUserApi } from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialUserValue?: string;
	userId?: string;
}

const AddUserModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialUserValue, userId } = props;
	const [userName, setUserName] = useState<string>(initialUserValue ?? "");
	const [inputError, setInputError] = useState<string | null>(null);
	const isEditModal: boolean = initialUserValue !== "";

	useEffect(() => {
		if (userName) {
			setInputError(null);
		}
	}, [userName]);

	const handleSubmitUser = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!userName) {
			setInputError("Please enter the name first");
		}
		const body = {
			name: userName,
			id: userId,
		};
		try {
			await upsertUserApi(
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
			title={<TitleComponent title={isEditModal ? "Edit User" : "New User"} />}
		>
			<TextInputComponent
				required
				title="Name"
				label="User Name"
				value={userName}
				error={inputError}
				setValue={setUserName}
				placeholder="Enter user Name"
			/>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					title="Save"
					w={100}
					onClick={handleSubmitUser}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddUserModal;
