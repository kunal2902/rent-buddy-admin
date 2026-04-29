import { LoginContainer } from "@/containers";
import { getBackgroundColor, getDarkMode } from "@/utils";

const LoginPage = () => (
	<>
		<main style={getBackgroundColor(getDarkMode() === "dark")}>
			<LoginContainer />
		</main>
	</>
	);

export default LoginPage;
