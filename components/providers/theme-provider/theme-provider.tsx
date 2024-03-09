"use client";

import { useThemeProvider } from "./hook";

interface Props {
	children: React.ReactNode;
}

const ThemeProvider = (props: Props) => {
	const { children } = props;

	const { currentTheme } = useThemeProvider();

	return <div className={`${currentTheme}`}>{children}</div>;
};

export default ThemeProvider;
