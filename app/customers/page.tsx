"use client";

import { MainNavbar, MainSidebar } from "@/components";
import CustomersContainer from "@/containers/9_customers/customers_container";

const CustomersPage = () => (
	<>
		<MainNavbar />
		<MainSidebar />
		<CustomersContainer />
	</>
);

export default CustomersPage;
