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
}

export const PermissionModal = (props: PermissionModalProps) => {
	const router = useRouter();
	const {
		openModal,
		setOpenModal,
	} = props;
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [permissions, setPermissions] = useState<PermissionModel[]>([]);

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
							checked={isAdmin}
							size={mantineSize}
							onChecked={setIsAdmin}
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
							selectAll={isAdmin}
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
						/>
						<DividerComponent mb={mantineSpaceHeight} />
					</StackComponent>
				</ScrollAreaComponent>
			))}
		</ModalComponent>
	);
};
