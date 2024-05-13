'use client';

import { DashboardPageHeader } from '@/components';
import { useTaxesSettingsContainer } from './hook';

const TaxesSettingsContainer = () => {
	const { isSidebarOpen } = useTaxesSettingsContainer();

	return (
		<main
			className={`flex min-h-screen w-full bg-light-background-natural flex-col pt-14 ${
				isSidebarOpen ? 'lg:pl-64 pl-0' : 'pl-16'
			}`}
		>
			<DashboardPageHeader
				heading="Taxes"
				className="sm:pl-5 pl-3 pr-3 my-4 sm:text-2xl text-xl"
			/>
		</main>
	);
};

export default TaxesSettingsContainer;
