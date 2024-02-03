import { MainNavbar, MainSidebar } from "@/components/common";

export default function Home() {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<main className="flex min-h-screen w-full bg-light-background-natural flex-col pt-14">
				<h1>Main Webpage</h1>
			</main>
		</>
	);
}
