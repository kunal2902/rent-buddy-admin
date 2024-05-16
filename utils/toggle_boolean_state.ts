import React from "react";
import { setCookie } from "cookies-next";
import { cookieOptions, sidebarStateConstant } from "@/utils/config";

export const toggleBooleanState =
	(setState: React.Dispatch<React.SetStateAction<boolean>>) => () => {
		setState((prev) => {
			setCookie(sidebarStateConstant, !prev, cookieOptions);
			return !prev;
		});
	};
