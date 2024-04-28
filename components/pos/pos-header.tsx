import { SolidBtn } from "@/components/elements";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import { Expand, ShoppingBag } from "lucide-react";
import { DraftModal } from "../modals/draft-modal";
import { useState } from "react";

const PosHeader = () => {
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
						width={Logo.width}
						height={Logo.height}
						alt="main logo"
						className="w-8 h-8 object-contain"
					/>
				</Link>
			</div>
			<div className="flex items-center m-3 order-last">
				<div
					className="px-2"
					onClick={() => {
						setDraftModalOpen(true);
					}}
				>
					<ShoppingBag />
				</div>
				<div className="px-5" onClick={toggleFullScreen}>
					<Expand />
				</div>
				<SolidBtn
					title="LogOut"
					className="w-fit px-5 py-1.5 rounded-md bg-black"
					link="/pos"
				/>
			</div>
		</>
	);
};

export default PosHeader;
