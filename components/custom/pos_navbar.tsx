"use client";

import Image from "next/image";
import { Expand, ShoppingBag, Shrink } from "lucide-react";
import { useState } from "react";
import { useFullscreen } from "@mantine/hooks";
import Logo from "@/public/images/logo.png";
import {
	ActionIconComponent,
	ButtonComponent,
	CenterComponent,
	DraftModal,
	SpaceComponent,
	TextComponent,
	TooltipComponent,
	UnstyledButtonComponent,
} from "@/components";
import { appLogoHeight, appLogoWidth, dashboardRoute, logoutUser, posRoute } from "@/utils";
import { useRouter } from "next/navigation";

export const PosNavbar = () => {
	const {
		toggle,
		fullscreen,
	} = useFullscreen();

	const router = useRouter();

	const [isDraftModalOpen, setDraftModalOpen] = useState(false);

	return (
		<>
			<DraftModal
				isOpen={isDraftModalOpen}
				onClose={() => {
					setDraftModalOpen(false);
				}}
			/>

			<div
				className="w-full pt-3 h-[56px] pb-3 flex fixed top-0 left-0 bg-light-background-natural items-center justify-between z-30 shadow">
				<div className="flex items-center">
					<SpaceComponent showWidth />
					<UnstyledButtonComponent
						display="flex"
						href={dashboardRoute}>
						<Image
							src={Logo.src}
							alt="main logo"
							width={appLogoWidth}
							height={appLogoHeight}
						/>

						<SpaceComponent showWidth />

						<CenterComponent>
							<TextComponent bold text="Back to Dashboard" />
						</CenterComponent>
					</UnstyledButtonComponent>
				</div>
				<div className="flex items-center">
					<ActionIconComponent
						onClick={() => {
							setDraftModalOpen(true);
						}}
					>
						<ShoppingBag size={18} />
					</ActionIconComponent>

					<SpaceComponent showWidth />

					<TooltipComponent
						label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
					>
						<ActionIconComponent
							onClick={toggle}
						>
							{
								fullscreen ? <Shrink size={18} /> :
								<Expand size={18} />
							}
						</ActionIconComponent>
					</TooltipComponent>

					<SpaceComponent showWidth />

					<ButtonComponent
						title="Logout"
						onClick={() => logoutUser(router)}
					/>
					<SpaceComponent showWidth />
				</div>
			</div>
		</>
	);
};
