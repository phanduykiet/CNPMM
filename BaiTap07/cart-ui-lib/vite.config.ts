import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "CartUILib",
      fileName: (format) => `cart-ui-lib.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "bootstrap"],
    },
  },
});
