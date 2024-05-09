'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/logo.png';
import { appLogoHeight, appLogoWidth, dashboardRoute } from '@/utils';

export const AuthNavbar = () => (
	<div className="w-full pt-4 pb-2 px-6 fixed top-0 left-0 bg-gradient-to-r from-light-background-natural to-light-background-default z-10">
		<Link href={dashboardRoute}>
			<Image
				src={Logo.src}
				alt="logo"
				height={appLogoHeight}
				width={appLogoWidth}
				className="w-8 h-8 object-contain"
			/>
		</Link>
	</div>
);
