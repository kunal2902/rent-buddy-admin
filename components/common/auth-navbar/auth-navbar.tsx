import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import Link from "next/link";

const AuthNavbar = () => {
	return (
		<div className="w-full pt-4 pb-2 px-6 fixed top-0 left-0 bg-gradient-to-r from-light-background-natural to-light-background-default z-10">
			<Link href="/">
				<Image
					src={Logo.src}
					alt="logo"
					height={Logo.height}
					width={Logo.width}
					className="w-8 h-8 object-contain"
				/>
			</Link>
		</div>
	);
};

export default AuthNavbar;
