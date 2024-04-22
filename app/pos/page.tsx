import { PosNavbar } from "@/components/common";

const POSHome = () => {
	return (
		<>
			<PosNavbar />
			<main className="w-full min-h-screen light-background-natural flex-col items-center justify-center font-public-sans px-4 pt-14 bg-light-background-natural">
				<h1 className="text-light-primary-text">
					Hello from POS Screen
				</h1>
			</main>
		</>
	);
};

export default POSHome;
