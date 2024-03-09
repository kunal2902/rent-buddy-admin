import { MainNavbar, MainSidebar } from "@/components/common";
import { CustomersScreen } from "@/components/screens";

const CustomersPage = () => {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<CustomersScreen />
		</>
	);
};

export default CustomersPage;
