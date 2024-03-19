import { MainNavbar, MainSidebar } from "@/components/common";
import { SettingsScreen } from "@/components/screens";

// TODO: The UI looks a bit weird here, because there was supposed to be a side bar that I have removed for the time being.

const SettingsPage = () => {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<SettingsScreen />
		</>
	);
};

export default SettingsPage;
