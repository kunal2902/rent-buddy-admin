import { sidebarStateAtom } from "@/atoms";
import { useRecoilValue } from "recoil";

export const usePaymentGatewayScreen = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
