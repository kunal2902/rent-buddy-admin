"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox, Collapse, Divider, Stack } from "@mantine/core";
import { toast } from "react-toastify";
import {
	ButtonComponent, GroupComponent,
	ModalComponent, SpaceComponent, TextComponent,
	TextInputComponent, TitleComponent,
} from "@/components";
import {
	getPermissionApi,
	mantineSize, upsertRoleApi,
} from "@/utils";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setCallApi: Dispatch<SetStateAction<boolean>>;
	initialRoleValue: string;
	roleId: string;
}

interface SelectedPermissions {
	[entity: string]: string[];
}

const AddRoleModal = (props: Props) => {
	const { isOpen, onClose, setCallApi, initialRoleValue, roleId } = props;
	const [roleName, setRoleName] = useState<string>(initialRoleValue);
	const [permissions, setPermissions] = useState([]);
	const [inputError, setInputError] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [openedIndex, setOpenedIndex] = useState(null);
	const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions>({});
	const [loading, setLoading] = useState(false);
	const isEditModal: boolean = initialRoleValue !== "";

	const handleToggle = (index: any) => {
		setOpenedIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	const handleCheckboxChange = (entity: string, permission: string) => {
		setSelectedPermissions((prevState) => {
			const entityPermissions = prevState[entity] || [];
			const isSelected = entityPermissions.includes(permission);
			const newPermissions = isSelected
				? entityPermissions.filter((perm) => perm !== permission)
				: [...entityPermissions, permission];
			return { ...prevState, [entity]: newPermissions };
		});
	};

	const formatPermissionsForSubmit = (selectedPerms: SelectedPermissions) => Object.entries(selectedPerms).map(([entity, perms]) => ({
			entity,
			permissions: perms,
		}));

	useEffect(() => {
		if (roleName) {
			setInputError(null);
		}
		getPermissionApi("",
			(data: any) => {
				setPermissions(data.permissions);
			},
			() => {},
			() => {},
		);
	}, [roleName]);

	const handleSubmitRole = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!roleName) {
			setInputError("Please enter the name first");
		}
		let roleBody = {};
		if (isAdmin) {
			roleBody = {
				id: roleId,
				name: roleName,
				isAdmin,
			};
		} else {
			roleBody = {
				id: roleId,
				name: roleName,
				isAdmin,
				permissions: formatPermissionsForSubmit(selectedPermissions),
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
					toast.error(message);
					setLoading(false);
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
			className="border-grey-800"
			title={<TitleComponent title={isEditModal ? "Edit Role" : "New Role"} />}
		>
			<Stack>
				<TextInputComponent
					required
					title="Name"
					label="Role Name"
					value={roleName}
					error={inputError}
					setValue={setRoleName}
					placeholder="Enter role Name"
				/>
				<Checkbox
					label="Is Admin?"
					size={mantineSize}
					onChange={(event) => setIsAdmin(event.currentTarget.checked)}
				/>
				{!isAdmin &&
					<>
						<TitleComponent title="Choose Permission" size="h5" />
						{permissions.map((item: any, index) => (
							<Stack key={index}>
								<GroupComponent justify="space-between">
									<TextComponent tt="capitalize" text={item.entity} />
									<ButtonComponent
										title={
											(selectedPermissions[item.entity]?.length || 0) > 0
												? "Change Permission"
												: "Select Permission"
										}
										onClick={() => handleToggle(index)}
									/>
								</GroupComponent>
								<Collapse
									in={openedIndex === index}
									transitionDuration={1000}
									transitionTimingFunction="linear"
								>
									<GroupComponent justify="space-between">
										{item.permissions.map((permission: any) => (
											<Checkbox
												key={permission}
												label={permission}
												checked={selectedPermissions[item.entity]
													?.includes(permission) || false}
												onChange={() =>
													handleCheckboxChange(item.entity, permission)}
											/>
										))}
									</GroupComponent>
								</Collapse>
								<Divider />
							</Stack>
						))}
					</>
				}
			</Stack>

			<SpaceComponent showHeight />

			<GroupComponent justify="end">
				<ButtonComponent
					loading={loading}
					title="Save"
					w={100}
					onClick={handleSubmitRole}
				/>
			</GroupComponent>
		</ModalComponent>
	);
};

export default AddRoleModal;
