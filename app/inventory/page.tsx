import { MainNavbar, InventorySidebar } from "@/components/common";
import { InventoryScreen } from "@/components/screens";

const InventoryPage = () => {
	return (
		<>
			<MainNavbar />
			{/* <MainSidebar /> */}
			<InventorySidebar />
			<InventoryScreen />
		</>
	);
};

export default InventoryPage;
