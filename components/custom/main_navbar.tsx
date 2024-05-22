"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import {
	useMainNavbar,
	ButtonComponent,
	ActionIconComponent,
	AvatarComponent,
	UnstyledButtonComponent,
	SpaceComponent,
	CenterComponent,
} from "@/components";
import {
	appLogoHeight,
	appLogoWidth,
	appName,
	dashboardRoute,
	posRoute,
} from "@/utils";
import { TextComponent } from "@/components/mantine/text_component";

export const MainNavbar = () => {
	const { toggleSidebar, userName } = useMainNavbar();

	return (
		<div
			className="w-full h-[56px] pt-3 pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between z-30 shadow">
			<div className="flex items-center">
				<SpaceComponent showWidth />

				<ActionIconComponent
					onClick={toggleSidebar}
					aria-label="Drawer button"
					className="accent-primary-lighter"
				>
					<Menu size={22} />
				</ActionIconComponent>

				<SpaceComponent showWidth />

				<UnstyledButtonComponent display="flex" href={dashboardRoute}>
					<Image
						src={Logo.src}
						alt="main logo"
						width={appLogoWidth}
						height={appLogoHeight}
					/>

					<SpaceComponent showWidth />

					<CenterComponent>
						<TextComponent bold text={appName} />
					</CenterComponent>
				</UnstyledButtonComponent>
			</div>

			<div className="flex items-center">
				<ButtonComponent
					px={5}
					w={80}
					mr={3}
					py={1.5}
					title="POS"
					href={posRoute}
				/>

				<SpaceComponent showWidth />

				{userName && (
					<AvatarComponent src={null} alt={userName}>
						{userName}
					</AvatarComponent>
				)}

				<SpaceComponent showWidth />
			</div>
		</div>
	);
};
