import { LoginContainer } from '@/containers';
import { AuthNavbar } from '@/components';

const LoginPage = () => (
	<>
		<AuthNavbar />
		<main className="w-full min-h-screen flex bg-gradient-to-r from-light-background-natural to-light-background-default flex-col items-center justify-center font-public-sans px-4 pt-8">
			<LoginContainer />
		</main>
	</>
);

export default LoginPage;
