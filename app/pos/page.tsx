"use client";
import React from "react";
import PosHeader from "@/components/pos/pos-header";
import PosProductSection from "@/components/pos/pos-product-section";
import PosCartSection from "@/components/pos/pos-cart-section";

const POSHome = () => {
	return (
		<main className="w-full h-screen flex bg-light-background-natural font-public-sans relative flex-col">
			<div className="w-full h-[5vh] text-center flex justify-between px-3">
				<PosHeader />
			</div>
			<div className="flex w-[100%] h-[95vh]">
				<PosProductSection />
				<PosCartSection />
			</div>
		</main>
	);
};

export default POSHome;
