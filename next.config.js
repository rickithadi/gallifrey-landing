/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Webpack optimization for Three.js and performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize Three.js and related libraries
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm': 'three/examples/jsm',
    };

    // Bundle analyzer in development
    if (dev && !isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.BUNDLE_ANALYZE': JSON.stringify(process.env.BUNDLE_ANALYZE || 'false'),
        })
      );
    }

    // Optimize chunk splitting for Three.js
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          three: {
            name: 'three',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          postprocessing: {
            name: 'postprocessing',
            test: /[\\/]node_modules[\\/]postprocessing[\\/]/,
            chunks: 'all',
            priority: 25,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=43200",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
