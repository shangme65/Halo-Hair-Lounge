/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
      },
      "*.vs": {
        loaders: ["raw-loader"],
      },
      "*.fs": {
        loaders: ["raw-loader"],
      },
      "*.vert": {
        loaders: ["raw-loader"],
      },
      "*.frag": {
        loaders: ["raw-loader"],
      },
    },
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: "Halo Hair Lounge",
  },
};

export default nextConfig;
