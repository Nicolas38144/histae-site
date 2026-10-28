import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  trailingSlash: true,
  ...(process.env.NODE_ENV === "development" ? {
    async rewrites() {
      return ["billing", "account", "privacy"].map(scope => ({
        source: `/api/web/${scope}/:path*`,
        destination: `${process.env.HISTAE_API_DEV_UPSTREAM || "http://127.0.0.1:8080"}/api/web/${scope}/:path*`,
      }));
    },
  } : {}),
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
