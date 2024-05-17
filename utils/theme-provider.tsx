"use client";

import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { Theme } from "@/types";
import { themeAtom } from "@/utils";

interface Props {
	children: React.ReactNode;
}

export const useThemeProvider = () => {
	const [currentTheme, setCurrentTheme] = useRecoilState<Theme>(themeAtom);
	const isProviderMounted = useRef<boolean>(false);

	const loadTheme = () => {
		const savedTheme = localStorage.getItem("theme");

		if (savedTheme !== "light" && savedTheme !== "dark") {
			setCurrentTheme("light");
			localStorage.setItem("theme", "light");
			return;
		}

		setCurrentTheme(savedTheme);
	};

	useEffect(() => {
		if (isProviderMounted.current) return;

		isProviderMounted.current = true;
		loadTheme();
	}, []);

	return {
		currentTheme,
	};
};

export const ThemeProvider = (props: Props) => {
	const { children } = props;

	const { currentTheme } = useThemeProvider();

	return <div className={`${currentTheme}`}>{children}</div>;
};
