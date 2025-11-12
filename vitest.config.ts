import { defineConfig } from "vitest/config"; // for running test
import react from "@vitejs/plugin-react"; // for frontend tests

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom", // environment for testing everything
    setupFiles: "./tests/setup.ts",
    // make sure the test files in the frontend and the backend being ran
    include: ["frontend/**/*.test.tsx", "backend/**/*.test.ts"],
  },
});
