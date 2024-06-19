import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true"
});

export default withBundleAnalyzer({
	reactStrictMode: false,
	eslint: {
		ignoreDuringBuilds: true
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost"
			},
			{
				protocol: "https",
				hostname: "source.unsplash.com"
			},
			{
				protocol: "https",
				hostname: "nca-crm.s3.ap-south-1.amazonaws.com"
			}
		]
	}
});
