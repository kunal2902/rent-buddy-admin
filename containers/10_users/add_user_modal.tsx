"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, PasswordInputComponent, SelectComponent, SpaceComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import { getRoleApi, logoutUser, upsertUserApi } from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialValueName: string;
	initialValueUserName: string;
	initialValueEmail: string;
	initialValuePassword: string;
	initialRoleId?: string;
	userId?: string;
}

const AddUserModal = (props: Props) => {
	const {
		isOpen,
		onClose,
		setCallApi,
		initialValueName,
		initialValueUserName,
		initialRoleId,
		initialValueEmail,
		initialValuePassword,
		userId,
	} = props;
	const router = useRouter();
	const [name, setName] = useState<string>(initialValueName);
	const [userName, setUserName] = useState<string>(initialValueUserName);
	const [password, setPassword] = useState<string>(initialValuePassword);
	const [email, setEmail] = useState<string>(initialValueEmail);
	const [inputError, setInputError] = useState<string | null>(null);
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [rolesList, setRolesList] = useState([]);
	const [roleId, setRoleId] = useState<string>(initialRoleId ?? "");
	const isEditModal: boolean = initialValueName !== "";

	useEffect(() => {
		if (userName) {
			setInputError(null);
		}
		getRoleApi("",
			(data: any) => {
				const formattedCategories = data.roles.map(
					(role: {
						role_id: string;
						name: string;
					}) => ({
						value: role.role_id,
						label: role.name,
					}));
				setRolesList(formattedCategories);
			},
			() => {},
			() => {
			logoutUser(router);
			});
	}, [userName]);

	const handleSubmitUser = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!userName) {
			setInputError("Please enter the name first");
		}
		const body = {
			email,
			password,
			name,
			id: userId,
			username: userName,
			role_id: roleId,
		};
		try {
			await upsertUserApi(
				body,
				(response) => {
					onClose();
					setCallApi(val => !val);
					ShowNotification(response.message, "success");
				},
				(message: string) => {
					ShowNotification(message, "error");
				},
				() => {
					logoutUser(router);
				},
			);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<ModalComponent
			opened={isOpen}
			onClose={onClose}
			className="border-grey-800"
			title={<TitleComponent title={isEditModal ? "Edit User" : "New User"} />}
		>
			<GroupComponent grow align="start">
				<Stack>
					<TextInputComponent
						required
						title="Name"
						label="Name"
						value={name}
						error={inputError}
						setValue={setName}
						placeholder="Enter Name"
					/>

					<TextInputComponent
						required
						title="User Name"
						label="User Name"
						value={userName}
						error={inputError}
						setValue={setUserName}
						placeholder="Enter user Name"
					/>

					<TextInputComponent
						required
						title="Email"
						label="Email"
						value={email}
						error={inputError}
						setValue={setEmail}
						placeholder="abc@gmail.com"
					/>

					<PasswordInputComponent
						mt={6}
						label="Password"
						value={password}
						placeholder="******"
						setValue={setPassword}
						visible={isPasswordVisible}
						onVisibilityChange={setIsPasswordVisible}
					/>

					<SelectComponent
						required
						label="Select role"
						placeholder="Select role"
						data={rolesList}
						clearable={false}
						value={roleId}
						setValue={setRoleId}
						checkIconPosition="right"
					/>
				</Stack>
			</GroupComponent>

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
