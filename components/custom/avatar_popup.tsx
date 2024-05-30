"use client";

import React, { forwardRef } from "react";
import { Divider, Popover, PopoverProps } from "@mantine/core";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { getEmail, getName, mantineRadius, useThemeProvider } from "@/utils";
import { AvatarComponent, ButtonComponent, TextComponent, TitleComponent } from "@/components";
import { StackComponent } from "@/components/mantine/stack_component";

/** Props list of Mantine's Popover component - https://mantine.dev/core/popover/?t=props */
export interface AvatarPopupComponentProps extends PopoverProps {

}

/** This is the Mantine Menu component - https://mantine.dev/core/menu/ */
export const AvatarPopupComponent = (props: AvatarPopupComponentProps) => {
	const userName = getName();
	const {
		darkMode,
		toggleDarkMode,
	} = useThemeProvider();
	const PopButton = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>((buttonProps, ref) => (
		<div ref={ref} {...buttonProps}>
			<AvatarComponent
				src={null}
				alt={userName}
				className="cursor-pointer"
			>
				{userName[0]}
			</AvatarComponent>
		</div>
	));

	return (
		<Popover
			withArrow
			offset={0}
			shadow="md"
			width={250}
			arrowPosition="center"
			radius={mantineRadius}
			{...props}
		>
			<Popover.Target>
				<PopButton />
			</Popover.Target>

			<Popover.Dropdown p={0}>
				<StackComponent gap={5} align="center" p={12}>
					<AvatarComponent h={60} w={60} src={null} alt={userName}>
						<TitleComponent
							size={26}
							c="white"
							title={userName[0]}
						/>
					</AvatarComponent>
					<TitleComponent title={userName} />
					<TextComponent text={getEmail()} c="dimmed" />
				</StackComponent>
				<Divider orientation="horizontal" />
				<ButtonComponent
					fullWidth
					radius={0}
					justify="start"
					variant="subtle"
					onClick={toggleDarkMode}
					leftSection={darkMode ?
						<MdOutlineDarkMode size={18} /> :
						<MdOutlineLightMode size={18} />
					}
					title={darkMode ? "Change to Light mode" : "Change to Dark mode"}
				/>
				<Divider orientation="horizontal" />
				<ButtonComponent
					fullWidth
					radius={0}
					title="Logout"
					justify="start"
					variant="subtle"
					leftSection={<IoIosLogOut size={18} />}
					style={{ borderRadius: "0 0 8px 8px" }}
				/>

			</Popover.Dropdown>
		</Popover>
	);
};
