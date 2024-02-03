import { MainNavbar, MainSidebar } from "@/components/common";
import { HomeScreen } from "@/components/screens";

export default function Home() {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<HomeScreen />
		</>
	);
}
