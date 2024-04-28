import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import {
	ReactQueryProvider,
	RecoilProvider,
	ThemeProvider,
} from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
	title: "NCA",
	description: "CRM for NCA",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${GeistSans.variable} ${GeistMono.variable}`}>
				<ReactQueryProvider>
					<RecoilProvider>
						<ThemeProvider>
							<TooltipProvider>{children}</TooltipProvider>
						</ThemeProvider>
					</RecoilProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
