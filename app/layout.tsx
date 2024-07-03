import "@mantine/core/styles.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import React from "react";
import { ColorSchemeScript } from "@mantine/core";
import { Metadata } from "next";
import { Notifications } from "@mantine/notifications";
import { mainTheme } from "@/constants";
import { appDescription, appTitle, ReactQueryProvider, RecoilProvider, ThemeProvider } from "@/utils";
import { MantineProviderComponent } from "@/components";
import "@mantine/notifications/styles.css";

export const metadata: Metadata = {
	title: appTitle,
	description: appDescription,
};

export default function RootLayout({ children }: { children: any }) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<link rel="shortcut icon" href="/images/logo.png" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
				<title>{appTitle}</title>
			</head>
			<body className={`${GeistSans.variable} ${GeistMono.variable}`}>
				<ReactQueryProvider>
					<RecoilProvider>
						<MantineProviderComponent theme={mainTheme}>
							<Notifications />
							<ThemeProvider>
								{children}
							</ThemeProvider>
						</MantineProviderComponent>
					</RecoilProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
