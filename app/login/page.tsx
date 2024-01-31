import { AuthNavbar } from "@/components/common";
import { LoginContainer } from "@/components/login-page";

const LoginPage = () => {
	return (
		<>
			<AuthNavbar />
			<main className="w-full min-h-screen flex bg-light-background-natural flex-col items-center justify-center font-public-sans px-4 pt-8">
				<LoginContainer />
			</main>
		</>
	);
};

export default LoginPage;
