import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers";

export const metadata: Metadata = {
	title: "NCA",
	description: "CRM for MCA",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</body>
		</html>
	);
}
