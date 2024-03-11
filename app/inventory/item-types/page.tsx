import { InventorySidebar, MainNavbar } from "@/components/common";
import { ItemTypesScreen } from "@/components/screens";

const ItemTypes = () => {
	return (
		<>
			<MainNavbar />
			<InventorySidebar />
			<ItemTypesScreen />
		</>
	);
};

export default ItemTypes;
