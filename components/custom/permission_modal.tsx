"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
	setSelectedPermission: (val: PermissionModel[]) => void
}

export const PermissionModal = (props: PermissionModalProps) => {
	const router = useRouter();
	const {
		openModal,
		setIsAdmin,
		setOpenModal,
		setSelectedPermission,
	} = props;
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [allCheckedList, setAllCheckedList] = useState<Array<boolean>>([]);
	const [permissions, setPermissions] = useState<PermissionModel[]>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<PermissionModel[]>([]);

	useEffect(() => {
		getPermissionApi("",
			(data: any) => {
				setPermissions(data.permissions);
			},
			() => {
			},
			() => logoutUser(router)
		).then();
	}, []);

	useEffect(() => {
		setSelectedPermission(selectedPermissions);
	}, [selectedPermissions]);

	useEffect(() => {
		setIsAdmin(selectAll);
	}, [selectAll]);

	return (
		<ModalComponent
			w={300}
			opened={openModal}
			closeOnEscape={false}
			closeOnClickOutside={false}
			onClose={() => setOpenModal(false)}
			title={
				<GroupComponent>
					<TooltipComponent label="Select All (Admin)">
						<CheckboxComponent
							label=""
							checked={selectAll}
							size={mantineSize}
							onChecked={setSelectAll}
						/>
					</TooltipComponent>
					<TitleComponent title="Choose Permissions" />
				</GroupComponent>
			}
		>
			{permissions.map((item, index) => (
				<ScrollAreaComponent key={index}>
					<StackComponent>
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
						<DividerComponent mb={mantineSpaceHeight} />
					</StackComponent>
				</ScrollAreaComponent>
			))}
		</ModalComponent>
	);
};
