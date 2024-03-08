import { themeAtom } from "@/atoms";
import { Theme } from "@/types/common";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

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
