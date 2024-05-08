'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import { useMainNavbar } from './hook';
import { appAccentColor, appName, getName } from '@/utils';
import { ButtonComponent, ActionIconComponent, AvatarComponent } from '@/components';

export const MainNavbar = () => {
	const { toggleSidebar } = useMainNavbar();

	return (
		<div
			className="w-full px-4 pt-3 pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between z-30 shadow">
			<div className="flex items-center">
				<ActionIconComponent
					onClick={toggleSidebar}
					aria-label="drawer button"
					className="flex items-center justify-center mr-3"
				>
					<Menu size={22} className="text-light-primary-text" />
				</ActionIconComponent>

				<Link href="/public">
					<Image
						src={Logo.src}
						width={50}
						height={50}
						alt="main logo"
						className="w-10 h-10 object-contain"
					/>
				</Link>
				<div
					className="ml-3 text-xl"
					style={{ color: appAccentColor }}
				>
					{appName}
				</div>
			</div>

			<div className="flex items-center">
				<ButtonComponent
					title="POS"
					href="/pos"
					className="w-24 px-5 mr-3 py-1.5 rounded-md" />

				<AvatarComponent src={null} alt={getName()}>
					{getName()[0]}
				</AvatarComponent>

			</div>
		</div>
	);
};
