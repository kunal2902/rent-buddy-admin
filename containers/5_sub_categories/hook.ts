import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const useSubCategoriesContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
