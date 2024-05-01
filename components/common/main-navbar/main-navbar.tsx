"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import { SolidBtn } from "@/components/elements";
import { useMainNavbar } from "./hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/elements/ui/avatar";
import { appAccentColor, appColor, appName, nameConstant, whiteColor } from "@/utils/config/config";
import { getCookie } from "cookies-next";

const MainNavbar = () => {
	const { toggleSidebar } = useMainNavbar();
	const userName = getCookie(nameConstant) ?? "";

	return (
		<div
			className="w-full px-4 pt-3 pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between z-30 shadow">
			<div className="flex items-center">
				<button
					className="flex items-center justify-center mr-3"
					aria-label="drawer button"
					onClick={toggleSidebar}
				>
					<Menu size={22} className="text-light-primary-text" />
				</button>

				<Link href="/">
					<Image
						src={Logo.src}
						width={Logo.width}
						height={Logo.height}
						alt="main logo"
						className="w-10 h-10 object-contain"
					/>
				</Link>
				<div className={"ml-3 text-xl"}
					 style={{ color: appAccentColor }}
				>
					{appName}
				</div>
			</div>

			<div className="flex items-center">
				<SolidBtn
					title="POS"
					style={{ backgroundColor: appAccentColor }}
					className={`w-24 px-5 mr-3 py-1.5 rounded-md`}
					link="/pos"
				/>

				<Avatar>
					<AvatarImage src="" />
					<AvatarFallback
						style={{ backgroundColor: appColor, color: whiteColor }}>{userName[0]}</AvatarFallback>
				</Avatar>
			</div>
		</div>
	);
};

export default MainNavbar;
