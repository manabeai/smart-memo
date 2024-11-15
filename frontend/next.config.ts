import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	watchOptions: {
		pollIntervalMs: 5000,
	},
};

export default nextConfig