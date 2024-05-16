import React from 'react';
import { PosProductSection, PosCartSection, PosNavbar } from '@/components';

const POSHome = () => (
	<main className="w-full h-screen overflow-hidden flex bg-light-background-natural font-public-sans relative flex-col">
		<div className="w-full text-center flex justify-between px-3 pt-2">
			<PosNavbar />
		</div>
		<div className="flex w-[100%] overflow-hidden mt-14">
			<PosProductSection />
			<PosCartSection />
		</div>
	</main>
);

export default POSHome;
