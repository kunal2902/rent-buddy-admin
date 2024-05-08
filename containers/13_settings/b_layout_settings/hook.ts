import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const useLayoutSettingsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
