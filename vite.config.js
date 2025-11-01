import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/my-store-app/" : "/", // 👈 match your repo name
  build: {
    outDir: "dist",
  },
}));
