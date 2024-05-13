import { useRecoilValue } from 'recoil';
import { sidebarStateAtom } from '@/utils';

export const useRolesSettingsContainer = () => {
	const isSidebarOpen = useRecoilValue<boolean>(sidebarStateAtom);

	return {
		isSidebarOpen,
	};
};
