import React from 'react';
import { PosHeader, PosProductSection, PosCartSection } from '@/components';

const POSHome = () => (
	<main className="w-full h-screen flex bg-light-background-natural font-public-sans relative flex-col">
		<div className="w-full h-[5vh] text-center flex justify-between px-3 pt-2">
			<PosHeader />
		</div>
		<div className="flex w-[100%] h-[95vh]">
			<PosProductSection />
			<PosCartSection />
		</div>
	</main>
);

export default POSHome;
