"use client";

import React, { forwardRef, useState } from "react";
import { Popover, PopoverProps, Switch } from "@mantine/core";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ActionIconComponent, ButtonComponent, GroupComponent, TextComponent } from "@/components";
import { mantineRadius } from "@/utils";

export enum PopConfirmType {
	// eslint-disable-next-line no-unused-vars
	switch = "switch",
	// eslint-disable-next-line no-unused-vars
	icon = "icon",
}
/** Props list of Mantine's Popover component - https://mantine.dev/core/popover/?t=props */
export interface PopConfirmComponentProps extends PopoverProps {
	onConfirm: () => Promise<void>,
	actionName: string,
	entityName: string,
	type?: PopConfirmType,
	isDisabled?: boolean,
}

/** This is the Mantine Menu component - https://mantine.dev/core/menu/ */
export const PopConfirmComponent = (props: PopConfirmComponentProps) => {
	const { onConfirm, actionName, entityName, type = PopConfirmType.icon, isDisabled } = props;
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);
	const PopButton = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>((buttonProps, ref) => (
		<div ref={ref} {...buttonProps}>
			{type === PopConfirmType.switch ?
				<Switch
					checked={isDisabled}
					onClick={() => setOpened(true)}
				/> :
				<ActionIconComponent onClick={() => setOpened(true)} size="md" color="red">
					<MdOutlineDeleteForever size={18} />
				</ActionIconComponent>
			}
		</div>
	));

	return (
		<Popover
			withArrow
			offset={0}
			shadow="md"
			width={250}
			opened={opened}
			onChange={setOpened}
			arrowPosition="center"
			radius={mantineRadius}
			{...props}
		>
			<Popover.Target>
				<PopButton />
			</Popover.Target>

			<Popover.Dropdown>
				<TextComponent
					text={`Are you sure you want to ${actionName} this ${entityName}?`}
				/>
				<GroupComponent justify="end" mt={20} gap="sm">
					<ButtonComponent
						px={0}
						w={50}
						size="xs"
						color="gray"
						title="No"
						variant="subtle"
						onClick={() => setOpened(false)}
					/>
					<ButtonComponent
						px={0}
						w={50}
						size="xs"
						title="Yes"
						loading={loading}
						color={actionName === "delete" ? "red" : undefined}
						onClick={async () => {
							setLoading(true);
							await onConfirm();
							setTimeout(() => {
								setLoading(false);
								setOpened(false);
							}, 1000);
						}}
					/>
				</GroupComponent>
			</Popover.Dropdown>
		</Popover>
	);
};
