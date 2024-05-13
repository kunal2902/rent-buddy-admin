'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import { appLogoHeight, appLogoWidth, posRoute } from '@/utils';

export const PosNavbar = () => (
	<nav className="w-full px-4 pt-3 pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between z-30 font-public-sans">
		<div className="flex items-center">
			<Link href={posRoute}>
				<div className="flex items-center">
					<Image
						src={Logo.src}
						width={appLogoWidth}
						height={appLogoHeight}
						alt="main logo"
						className="w-8 h-8 object-contain"
					/>

					<h1 className="ml-1 text-xl tracking-wider font-medium text-light-primary-text">
						POS
					</h1>
				</div>
			</Link>
		</div>
	</nav>
);
