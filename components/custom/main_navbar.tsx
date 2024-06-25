"use client";

import { Menu } from "lucide-react";
import Logo from "@/public/images/logo.png";
import {
	ActionIconComponent,
	AvatarPopupComponent,
	ButtonComponent,
	CenterComponent,
	ImageComponent,
	SpaceComponent,
	TextComponent,
	UnstyledButtonComponent,
	useMainNavbar,
} from "@/components";
import {
	appLogoHeight,
	appLogoWidth,
	appName,
	dashboardRoute,
	getSurfaceColor,
	posRoute,
	useThemeProvider,
} from "@/utils";

export const MainNavbar = () => {
	const { toggleSidebar } = useMainNavbar();
	const { darkMode } = useThemeProvider();

	return (
		<div
			className="w-full h-[56px] pt-3 pb-3 flex fixed top-0 left-0 items-center justify-between z-30 shadow"
			style={getSurfaceColor(darkMode)}
		>
			<div className="flex items-center">
				<SpaceComponent showWidth />

				<ActionIconComponent
					onClick={() => toggleSidebar()}
					aria-label="Drawer button"
					className="accent-primary-lighter"
				>
					<Menu size={22} />
				</ActionIconComponent>

				<SpaceComponent showWidth />

				<UnstyledButtonComponent display="flex" href={dashboardRoute}>
					<ImageComponent
						src={Logo.src}
						w={appLogoWidth}
						h={appLogoHeight}
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

				{/*<TooltipComponent
					label={darkMode ? "Change to Light mode" : "Change to Dark mode"}>
					<ActionIconComponent
						variant="filled"
						onClick={toggleDarkMode}
					>
						{darkMode ?
							<MdOutlineDarkMode size={18} /> :
							<MdOutlineLightMode size={18} />
						}
					</ActionIconComponent>
				</TooltipComponent>*/}

				<AvatarPopupComponent />

				<SpaceComponent showWidth />
			</div>
		</div>
	);
};
