import { LoginContainer } from "@/containers";
import { getBackgroundColor, getDarkMode } from "@/utils";

const LoginPage = () => (
	<>
		<main
			className="w-full min-h-screen flex flex-col items-center justify-center font-public-sans px-4 pt-8"
			style={getBackgroundColor(getDarkMode() === "dark")}>
			<LoginContainer />
		</main>
	</>
	);

export default LoginPage;
