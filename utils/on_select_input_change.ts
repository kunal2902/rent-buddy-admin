import React from "react";
import { ComboboxItem } from "@mantine/core";

export const onSelectInputChange = <T =
          string>(setState: React.Dispatch<React.SetStateAction<T | null>>) =>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(value: T | null, option: ComboboxItem) => setState(value);
