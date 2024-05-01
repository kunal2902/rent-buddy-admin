"use client";
import { MainNavbar, MainSidebar } from "@/components/common";
import { HomeScreen } from "@/components/screens";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { userIdConstant, userNameConstant } from "@/utils/config/config";

export default function Home() {

	useEffect(() => {
		console.log(getCookie(userIdConstant));
		console.log(getCookie(userNameConstant));
	}, []);

	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<HomeScreen />
		</>
	);
}
