import { MainNavbar, MainSidebar } from "@/components";
import UsersContainer from "@/containers/10_users/users_container";

const UsersPage = () => (
	<>
		<MainNavbar />
		<MainSidebar />
		<UsersContainer />
	</>
);

export default UsersPage;
