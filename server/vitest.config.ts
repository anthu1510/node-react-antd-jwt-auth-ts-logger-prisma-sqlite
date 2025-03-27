import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enable global test functions (optional)
    setupFiles: "./tests/setup.ts", // Ensure correct path
    environment: "node", // Ensure a Node.js environment if needed
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "build"],
  },
});
