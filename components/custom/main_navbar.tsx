'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import {
	useMainNavbar,
	ButtonComponent,
	ActionIconComponent,
	AvatarComponent,
	UnstyledButtonComponent, SpaceComponent, CenterComponent,
} from '@/components';
import { appAccentColor, appLogoHeight, appLogoWidth, appName, dashboardRoute, getName, posRoute } from '@/utils';
import { TextComponent } from '@/components/mantine/text_component';

export const MainNavbar = () => {
	const { toggleSidebar } = useMainNavbar();

	return (
		<div
			className="w-full px-4 pt-3 pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between z-30 shadow">
			<div className="flex items-center">
				<ActionIconComponent
					onClick={toggleSidebar}
					aria-label="Drawer button"
					className="accent-primary-lighter"
				>
					<Menu size={22} />
				</ActionIconComponent>

				<SpaceComponent width />

				<UnstyledButtonComponent
					display="flex"
					href={dashboardRoute}>
					<Image
						src={Logo.src}
						alt="main logo"
						width={appLogoWidth}
						height={appLogoHeight}
					/>

					<SpaceComponent width />

					<CenterComponent>
						<TextComponent bold text={appName} c={appAccentColor} />
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

				<SpaceComponent width />

				<AvatarComponent src={null} alt={getName()}>
					{getName()[0]}
				</AvatarComponent>

			</div>
		</div>
	);
};
