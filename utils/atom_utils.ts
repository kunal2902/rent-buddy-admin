'use client';

import { atom } from 'recoil';
import { Theme } from '@/types/common';
import { getSidebarState } from '@/utils/config';

export const sidebarStateAtom = atom<boolean>({
	key: 'sidebarStateAtom',
	default: getSidebarState() === 'true',
});

export const openSubMenuAtom = atom<Array<number>>({
	key: 'openSubMenuAtom',
	default: [],
});

export const themeAtom = atom<Theme>({
	key: 'themeAtom',
	default: 'light',
});
