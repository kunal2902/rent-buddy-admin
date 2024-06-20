import React from "react";

export const toggleBooleanState =
	(setState: React.Dispatch<React.SetStateAction<boolean>>) =>
	(newState?: boolean) => {
		// eslint-disable-next-line no-unneeded-ternary
		setState((prev) => (newState ? newState : !prev));
	};
