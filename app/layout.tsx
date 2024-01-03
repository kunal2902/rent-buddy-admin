import type { Metadata } from "next";
import "./globals.css";

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
			<body>{children}</body>
		</html>
	);
}
