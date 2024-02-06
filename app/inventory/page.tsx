import { MainNavbar, MainSidebar } from "@/components/common";
import { InventoryScreen } from "@/components/screens";

const InventoryPage = () => {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<InventoryScreen />
		</>
	);
};

export default InventoryPage;
