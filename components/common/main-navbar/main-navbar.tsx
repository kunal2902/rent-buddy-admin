"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import { SolidBtn } from "@/components/elements";

const MainNavbar = () => {
	return (
		<div className="w-full px-4 pt-3 pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between">
			<div className="flex items-center">
				<button
					className="flex items-center justify-center mr-3"
					aria-label="drawer button"
				>
					<Menu size={22} className="text-light-primary-text" />
				</button>

				<Link href="/">
					<Image
						src={Logo.src}
						width={Logo.width}
						height={Logo.height}
						alt="main logo"
						className="w-8 h-8 object-contain"
					/>
				</Link>
			</div>

			<div className="flex items-center">
				<SolidBtn
					title="POS"
					className="w-fit px-5 py-1.5 rounded-md bg-black"
				/>
			</div>
		</div>
	);
};

export default MainNavbar;
