import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bcrypt: false,
        "@mapbox/node-pre-gyp": false,
        "node-pre-gyp": false,
      };
      // Ignore these modules on client side
      config.externals = [
        ...(config.externals || []),
        'bcrypt',
        '@mapbox/node-pre-gyp',
        'node-pre-gyp'
      ];
      // Add null loader for HTML files in node_modules
      config.module.rules.push({
        test: /\.html$/,
        include: /node_modules/,
        use: 'null-loader'
      });
    }
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['steamcdn-a.akamaihd.net', 'avatars.steamstatic.com'],
  },
};

export default nextConfig;