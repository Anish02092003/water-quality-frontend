import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "recharts": "recharts"
    },
  },
  build: {
    rollupOptions: {
      external: ["recharts"], // Ensures Vite resolves recharts correctly
    },
  },
});
