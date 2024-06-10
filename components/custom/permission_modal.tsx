"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ButtonComponent,
	DividerComponent,
	GroupComponent,
	IndeterminateCheckbox,
	ModalComponent,
	ScrollAreaComponent,
	TitleComponent,
	TooltipComponent,
} from "@/components";
import { getPermissionApi, logoutUser, mantineSize, mantineSpaceHeight } from "@/utils";
import { StackComponent } from "@/components/mantine/stack_component";
import { CheckboxComponent } from "@/components/mantine/checkbox_component";
import { PermissionModel } from "@/models";

export interface PermissionModalProps {
	openModal: boolean,
	setOpenModal: (val: boolean) => void;
	setIsAdmin: (val: boolean) => void;
	setTotalPermissions: (val: PermissionModel[]) => void;
	setSelectedPermission: (val: PermissionModel[]) => void;
	rolePermissions: PermissionModel[];
}

export const PermissionModal = (props: PermissionModalProps) => {
	const router = useRouter();
	const {
		openModal,
		setIsAdmin,
		setOpenModal,
		setTotalPermissions,
		setSelectedPermission,
		rolePermissions,
	} = props;
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [allCheckedList, setAllCheckedList] = useState<Array<boolean>>([]);
	const [permissions, setPermissions] = useState<PermissionModel[]>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<PermissionModel[]>([]);
	console.log("permissions", permissions);
	useEffect(() => {
		getPermissionApi("",
			(data: any) => {
				setPermissions(data.permissions);
				setTotalPermissions(data.permissions);
			},
			() => {
			},
			() => logoutUser(router)
		).then();
	}, []);

	return (
		<ModalComponent
			// w={400}
			opened={openModal}
			closeOnEscape={false}
			closeOnClickOutside={false}
			onClose={() => setOpenModal(false)}
			title={
				<GroupComponent justify="space-between" w="360">
					<GroupComponent>
						<TooltipComponent label="Select All (Admin)">
							<CheckboxComponent
								label=""
								checked={selectAll}
								size={mantineSize}
								onChecked={setSelectAll}
							/>
						</TooltipComponent>
						<GroupComponent grow>
							<TitleComponent title="Choose Permissions" />
						</GroupComponent>
					</GroupComponent>
					<ButtonComponent
						title="Submit"
						variant="light"
						onClick={() => {
							setIsAdmin(selectAll);
							setOpenModal(false);
							setSelectedPermission(selectedPermissions);
						}}
					/>
				</GroupComponent>
			}
		>
			<ScrollAreaComponent>
				{permissions.map((item, index) => (
					<StackComponent key={index}>
						<DividerComponent mt={index === 0 ? 0 : mantineSpaceHeight} />
						<IndeterminateCheckbox
							selectAll={selectAll}
							selectedPermissionModel={
								{
									entity: item.entity,
									permissions: item.permissions.map(str => ({
										permission: str,
										checked: false,
									})),
									checked: false,
								}
							}
							setSelectedPermissionModel={(perm) => {
								setSelectedPermissions((val) => {
									const tempArray = val;
									tempArray[index] = perm;
									return tempArray;
								});
							}}
							setAllChecked={(val) => {
								const tempList = allCheckedList;
								tempList[index] = val;
								setAllCheckedList(tempList);
								const allChecked = tempList.every((value) => value);
								setSelectAll(allChecked);
							}}
						/>
					</StackComponent>
				))}
			</ScrollAreaComponent>
		</ModalComponent>
	);
};
