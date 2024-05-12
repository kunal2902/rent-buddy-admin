'use client';

import { CustomerContainer } from '@/containers';
import { MainNavbar, MainSidebar } from '@/components';

const CustomersPage = () => (
	<>
		<MainNavbar />
		<MainSidebar />
		<CustomerContainer />
	</>
);

export default CustomersPage;
