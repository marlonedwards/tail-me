import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // explicitly set root
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000,
  },
  // Specify the entry point
  optimizeDeps: {
    entries: ["./src/App.tsx"],
  },
});
