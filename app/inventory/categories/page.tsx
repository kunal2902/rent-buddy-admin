import { InventorySidebar, MainNavbar } from "@/components/common";
import { CategoriesScreen } from "@/components/screens";

const CategoriesPage = () => {
	return (
		<>
			<MainNavbar />
			<InventorySidebar />
            <CategoriesScreen />
		</>
	);
};

export default CategoriesPage;
