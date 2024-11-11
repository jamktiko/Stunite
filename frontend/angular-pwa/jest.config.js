module.exports = {
  preset: "jest-preset-angular",
  testEnvironment: "jsdom",
  testMatch: ["**/+(*.)+(spec).+(ts|js)?(x)"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
};
