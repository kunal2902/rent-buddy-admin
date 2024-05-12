import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const useActivityLogsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
