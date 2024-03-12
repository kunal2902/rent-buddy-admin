import { MainNavbar, SettingSidebar } from "@/components/common";
import { PaymentGatewayScreen } from "@/components/screens";

// TODO: The UI looks a bit weird here, because there was supposed to be a side bar that I have removed for the time being.

const PaymentGatewayPage = () => {
	return (
		<>
			<MainNavbar />
			<SettingSidebar />
			<PaymentGatewayScreen />
		</>
	);
};

export default PaymentGatewayPage;
