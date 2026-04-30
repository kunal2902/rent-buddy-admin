import { MainNavbar, MainSidebar } from "@/components";
import { ProductsContainer } from "@/containers/2_products/items_container";

const ProductsPage = () => (
	<>
		<MainNavbar />
		<MainSidebar />
		<ProductsContainer />
	</>
);

export default ProductsPage;
