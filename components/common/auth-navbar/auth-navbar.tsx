import Image from "next/image";
import Logo from "@/assets/images/logo.png";

const AuthNavbar = () => {
	return (
		<div className="w-full pt-6 pb-2 px-6 fixed top-0 left-0 bg-light-background-natural z-10">
			<Image
				src={Logo.src}
				alt="logo"
				height={Logo.height}
				width={Logo.width}
				className="w-8 h-8 object-contain"
			/>
		</div>
	);
};

export default AuthNavbar;
