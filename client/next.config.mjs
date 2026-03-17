// export default {
//   turbopack: {},
//   webpack: (config) => {
//     return {
//       ...config,
//       watchOptions: {
//         ...config.watchOptions,
//         poll: 300,
//       },
//     };
//   },
//   allowedDevOrigins: ["ticketing.dev"],
// };


const config = {
  turbopack: {},

  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 300,
      },
    };
  },

  // Allow requests from your custom domain in dev
  allowedDevOrigins: ["ticketing.dev"],

  // Rewrite API calls to Kubernetes ingress
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://ticketing.dev/api/:path*",
      },
    ];
  },
};

export default config;
