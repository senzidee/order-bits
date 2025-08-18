import { pluginSass } from "@rsbuild/plugin-sass";

export default {
  html: {
    title: "Order Bits",
  },
  plugins: [pluginSass()],
  output: {
    distPath: {
      root: "../static",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
