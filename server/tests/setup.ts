import { vi, beforeEach } from "vitest";

// Mock the environment configuration
vi.mock("../src/config/env", () => ({
  env: {
    NODE_ENV: "test",
    ACCESS_TOKEN_SECRET: "test_secret",
    REFRESH_TOKEN_SECRET: "test_refresh_secret",
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});
