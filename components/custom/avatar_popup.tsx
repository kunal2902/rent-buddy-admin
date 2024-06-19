"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { PopoverProps } from "@mantine/core";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useRouter } from "next/navigation";
import { getEmail, getName, logoutUser, useThemeProvider } from "@/utils";
import {
	AvatarComponent,
	ButtonComponent,
	DividerComponent,
	LoaderComponent,
	PopoverComponent,
	PopoverDropdownComponent,
	PopoverTargetComponent,
	StackComponent,
	TextComponent,
	TitleComponent,
} from "@/components";

/** Props list of Mantine's Popover component - https://mantine.dev/core/popover/?t=props */
export interface AvatarPopupComponentProps extends PopoverProps {

}

/** This is the Mantine Menu component - https://mantine.dev/core/menu/ */
export const AvatarPopupComponent = (props: AvatarPopupComponentProps) => {
	const {
		darkMode,
		toggleDarkMode,
	} = useThemeProvider();
	const router = useRouter();
	const [name, setName] = useState<string>("");
	const [loadingName, setLoadingName] = useState<boolean>(true);
	const [loadingLogout, setLoadingLogout] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setName(getName());
			setLoadingName(false);
		}, 1000);
	}, []);

	const PopButton = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>((buttonProps, ref) => (
		<div ref={ref} {...buttonProps}>
			<AvatarComponent
				src={null}
				alt={name}
				className="cursor-pointer"
			>
				{
					loadingName ?
						<LoaderComponent color="white" /> :
						<TitleComponent title={name[0]} c="white" />
				}
			</AvatarComponent>
		</div>
	));

	return (
		<PopoverComponent
			{...props}
		>
			<PopoverTargetComponent>
				<PopButton />
			</PopoverTargetComponent>

			<PopoverDropdownComponent p={0}>
				<StackComponent gap={5} align="center" p={12}>
					<AvatarComponent h={60} w={60} src={null} alt={name}>
						<TitleComponent
							size={26}
							c="white"
							title={name[0]}
						/>
					</AvatarComponent>
					<TitleComponent title={name} />
					<TextComponent text={getEmail()} c="dimmed" />
				</StackComponent>
				<DividerComponent orientation="horizontal" />
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
				<DividerComponent orientation="horizontal" />
				<ButtonComponent
					fullWidth
					radius={0}
					title="Logout"
					justify="start"
					variant="subtle"
					loading={loadingLogout}
					leftSection={<IoIosLogOut size={18} />}
					style={{ borderRadius: "0 0 8px 8px" }}
					onClick={() => {
						setLoadingLogout(true);
						setTimeout(() => {
							setLoadingLogout(false);
							logoutUser(router);
						}, 1500);
					}}
				/>

			</PopoverDropdownComponent>
		</PopoverComponent>
	);
};
