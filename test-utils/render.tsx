import { render as testingLibraryRender } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { mainTheme } from "@/constants/mantine_theme";

export function render(ui: React.ReactNode) {
	return testingLibraryRender(<>{ui}</>, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<MantineProvider theme={mainTheme}>{children}</MantineProvider>
		),
	});
}
