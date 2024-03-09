import { MainNavbar } from "@/components/common";
import { UsersScreen } from "@/components/screens";

// TODO: The UI looks a bit weird here, because there was supposed to be a side bar that I have removed for the time being.

const UsersPage = () => {
	return (
		<>
			<MainNavbar />
			{/* <MainSidebar /> */}
			<UsersScreen />
		</>
	);
};

export default UsersPage;
