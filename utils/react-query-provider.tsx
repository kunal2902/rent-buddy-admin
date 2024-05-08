'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { getQueryClient } from '@/utils';

interface ReactQueryProviderProps {
	children: React.ReactNode;
}

export const ReactQueryProvider = (props: ReactQueryProviderProps) => {
	const { children } = props;

	const client = getQueryClient();

	return (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	);
};
