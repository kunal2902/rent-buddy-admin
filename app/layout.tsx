import "@mantine/core/styles.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { theme } from "@/theme";
import { appDescription, appTitle, ReactQueryProvider, RecoilProvider, ThemeProvider } from "@/utils";

export const metadata: Metadata = {
	title: appTitle,
	description: appDescription,
};

export default function RootLayout({ children }: { children: any }) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<link rel="shortcut icon" href="/favicon.svg" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
				<title>{appTitle}</title>
			</head>
			<body className={`${GeistSans.variable} ${GeistMono.variable}`}>
				<ReactQueryProvider>
					<RecoilProvider>
						<MantineProvider theme={theme}>
							<ThemeProvider>
								{children}
								<ToastContainer
									autoClose={2000}
									hideProgressBar
									closeOnClick
									rtl={false}
								/>
							</ThemeProvider>
						</MantineProvider>
					</RecoilProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
