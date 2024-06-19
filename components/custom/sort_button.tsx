"use client";

import React, { forwardRef, useState } from "react";
import { Menu, MenuProps } from "@mantine/core";
import { MdSort } from "react-icons/md";
import { CheckIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { ActionIconComponent } from "@/components";
import { appColorRGBA, getSurfaceColor, mantineRadius, useThemeProvider } from "@/utils";

export enum SortItemDirection {
	// eslint-disable-next-line no-unused-vars
	ascending = "asc",
	// eslint-disable-next-line no-unused-vars
	descending = "desc",
}

export interface SortButtonComponentItemProps {
	id: string | number,
	label: string,
	value: string,
	icon: IconType,
	direction: SortItemDirection
}

/** Props list of Mantine's Menu component - https://mantine.dev/core/menu/?t=props */
export interface SortButtonComponentProps extends MenuProps {
	items: Array<SortButtonComponentItemProps>,
	onSelected: Function

}

/** This is the Mantine Menu component - https://mantine.dev/core/menu/ */
export const SortButtonComponent = (props: SortButtonComponentProps) => {
	const { darkMode } = useThemeProvider();
	const {
		items,
		onSelected,
		...rest
	} = props;
	const [selected, setSelected] = useState<SortButtonComponentItemProps>();
	const SortButton = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>((buttonProps, ref) => (
		<div ref={ref} {...buttonProps}>
			<ActionIconComponent
				variant="filled"
				c={appColorRGBA}
				color={getSurfaceColor(darkMode).backgroundColor}
			>
				<MdSort />
			</ActionIconComponent>
		</div>
	));

	return (
		<Menu
			withArrow
			offset={0}
			shadow="md"
			width={250}
			position="top"
			openDelay={100}
			closeDelay={400}
			trigger="click-hover"
			arrowPosition="center"
			radius={mantineRadius}
			{...rest}
		>
			<Menu.Target>
				<SortButton />
			</Menu.Target>

			<Menu.Dropdown>
				{
					items.map((menuComponentItem: SortButtonComponentItemProps) =>
						<Menu.Item
							key={menuComponentItem.id}
							onClick={() => {
								setSelected(menuComponentItem);
								onSelected(menuComponentItem);
							}}
							leftSection={<menuComponentItem.icon size={22} />}
							rightSection={selected?.id === menuComponentItem.id ?
								<CheckIcon size={16} /> :
								null
							}
						>
							{menuComponentItem.label}
						</Menu.Item>
					)}
			</Menu.Dropdown>
		</Menu>
	);
};
