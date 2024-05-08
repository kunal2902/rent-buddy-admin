'use client';

import { RecoilRoot } from 'recoil';
import React from 'react';

interface RecoilProviderProps {
	children: React.ReactNode;
}

export const RecoilProvider = (props: RecoilProviderProps) => {
	const { children } = props;

	return <RecoilRoot>{children}</RecoilRoot>;
};
