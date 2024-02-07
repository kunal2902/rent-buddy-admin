import { MainNavbar, MainSidebar } from "@/components/common";
import { ReceiptsScreen } from "@/components/screens";

const ReceiptsPage = () => {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<ReceiptsScreen />
		</>
	);
};

export default ReceiptsPage;
