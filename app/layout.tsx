import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider, RecoilProvider } from "@/components/providers";

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
			<body>
				<ReactQueryProvider>
					<RecoilProvider>{children}</RecoilProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
