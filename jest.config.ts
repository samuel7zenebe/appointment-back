import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.jest.json",
    },
  },
};

export default config;
