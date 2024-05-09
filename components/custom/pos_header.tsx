"use client";

import Link from "next/link";
import Image from "next/image";
import { Expand, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Logo from "@/public/images/logo.png";
import { ActionIconComponent, ButtonComponent, DraftModal } from "@/components";

export const PosHeader = () => {
	function toggleFullScreen() {
		document.documentElement.requestFullscreen();
	}

	const [isDraftModalOpen, setDraftModalOpen] = useState(false);

	return (
		<>
			<DraftModal
				isOpen={isDraftModalOpen}
				onClose={() => {
					setDraftModalOpen(false);
				}}
			/>
			<div className="flex items-center m-3">
				<Link href="/">
					<Image
						src={Logo.src}
						width={50}
						height={50}
						alt="main logo"
						className="w-8 h-8 object-contain"
					/>
				</Link>
			</div>
			<div className="flex items-center m-3 order-last">
				<ActionIconComponent
					px={2}
					onClick={() => {
						setDraftModalOpen(true);
					}}
				>
					<ShoppingBag />
				</ActionIconComponent>

				<ActionIconComponent
					px={5}
					onClick={toggleFullScreen}
				>
					<Expand />
				</ActionIconComponent>

				<ButtonComponent title="LogOut" href="/pos" fullWidth px={5} py={1.5} />

			</div>
		</>
	);
};
