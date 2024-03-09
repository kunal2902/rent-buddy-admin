import { MainNavbar, InventorySidebar } from "@/components/common";
import { ItemsScreen } from "@/components/screens";

const ItemsPage = () => {
	return (
		<>
			<MainNavbar />
			<InventorySidebar />
			<ItemsScreen />
		</>
	);
};

export default ItemsPage;
