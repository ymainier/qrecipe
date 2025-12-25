import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "db/migrations"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.ts", "components/**/*.tsx", "app/**/*.ts", "app/**/*.tsx"],
      exclude: ["**/*.d.ts", "**/node_modules/**", "db/migrations/**"],
    },
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
