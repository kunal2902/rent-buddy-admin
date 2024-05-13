import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const usePrivacyPolicyPageContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
