"use client";

import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { useMantineColorScheme } from "@mantine/core";
import { setCookie } from "cookies-next";
import { Theme } from "@/types";
import { cookieOptions, getDarkMode, themeAtom, themeModeConstant } from "@/utils";

interface Props {
	children: React.ReactNode;
}

export const useThemeProvider = () => {
	const { setColorScheme } = useMantineColorScheme();
	const isProviderMounted = useRef<boolean>(false);
	const [currentTheme, setCurrentTheme] = useRecoilState<Theme>(themeAtom);

	const loadTheme = () => {
		const savedTheme = getDarkMode();

		if (savedTheme !== "light" && savedTheme !== "dark") {
			setCurrentTheme("light");
			setCookie(themeModeConstant, "light", cookieOptions);
			return;
		}

		setCurrentTheme(savedTheme);
	};

	const toggleDarkMode = () => {
		setColorScheme(currentTheme === "dark" ? "light" : "dark");
		setCookie(themeModeConstant, currentTheme === "dark" ? "light" : "dark", cookieOptions);
		//Must be last
		setCurrentTheme(currentTheme === "dark" ? "light" : "dark");
	};

	useEffect(() => {
		if (isProviderMounted.current) return;

		isProviderMounted.current = true;
		loadTheme();
	}, []);

	return {
		darkMode: currentTheme === "dark",
		currentTheme,
		toggleDarkMode,
	};
};

export const ThemeProvider = (props: Props) => {
	const { children } = props;

	const { currentTheme } = useThemeProvider();

	return <div className={`${currentTheme}`}>{children}</div>;
};
