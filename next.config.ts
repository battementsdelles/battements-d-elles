import type { NextConfig } from 'next';
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/typeorm\/util\/ImportUtils\.js/ },
      {
        module:
          /node_modules\/typeorm\/util\/DirectoryExportedClassesLoader\.js/,
      },
      { module: /node_modules\/typeorm\/platform\/PlatformTools\.js/ },
      {
        module:
          /node_modules\/typeorm\/connection\/ConnectionOptionsReader\.js/,
      },
      {
        module:
          /node_modules\/typeorm\/browser\/driver\/react-native\/ReactNativeDriver\.js/,
      },
      { module: /node_modules\/app-root-path\/lib\/app-root-path\.js/ },
    ];

    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: [
          /mongodb/,
          /mssql/,
          /mysql/,
          /mysql2/,
          /oracledb/,
          /pg/,
          /pg-native/,
          /pg-query-stream/,
          /react-native-sqlite-storage/,
          /redis/,
          /sqlite3/,
          /sql.js/,
          /typeorm-aurora-data-api-driver/,
          /hdb-pool/,
          /spanner/,
          /hana-client/,
        ],
      }),
    );
    return config;
  } /* config options here */,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
