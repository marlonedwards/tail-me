import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
    include: ['buffer'],
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
});