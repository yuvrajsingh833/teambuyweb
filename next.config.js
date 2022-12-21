/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }));
    return config;
  },
  images: {
    domains: [
      '*.teambuy.co.in',
      'admin.teambuy.co.in',
      'teambuyadmin.csiworld.tech',
      "teambuy.s3.ap-south-1.amazonaws.com"
    ]
  },
  experimental: {
    images: {
      layoutRaw: true
    }
  },
}

module.exports = nextConfig
