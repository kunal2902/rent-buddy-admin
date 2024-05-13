import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const useContactPageContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
