import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "pg-native": "commonjs pg-native",
        mysql: "commonjs mysql",
        mysql2: "commonjs mysql2",
        sqlite3: "commonjs sqlite3",
        "better-sqlite3": "commonjs better-sqlite3",
        oracledb: "commonjs oracledb",
        redis: "commonjs redis",
        ioredis: "commonjs ioredis",
        mongodb: "commonjs mongodb",
        "react-native-sqlite-storage": "commonjs react-native-sqlite-storage",
        "@sap/hana-client": "commonjs @sap/hana-client",
      });
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pg-native": false,
      "react-native-sqlite-storage": false,
      "@sap/hana-client/extension/Stream": false,
    };

    return config;
  },
};

export default nextConfig;
