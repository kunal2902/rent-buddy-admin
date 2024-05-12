import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const useItemTypesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
