import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const baseConfig = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// next/jest reads tsconfig.json's "paths" (@/* -> src/*) automatically,
// so no manual moduleNameMapper is needed for the import alias.
//
// transformIgnorePatterns is applied AFTER createJestConfig resolves,
// not merged into baseConfig above — next/jest's internal merge logic
// otherwise overrides a custom transformIgnorePatterns with its own
// default, silently ignoring ours. Wrapping like this guarantees our
// override wins, since it's applied on the final resolved config.
async function config() {
  const nextJestConfig = await createJestConfig(baseConfig)();
  return {
    ...nextJestConfig,
    // MSW ships several internal ESM-only dependencies (@mswjs/interceptors,
    // rettime, strict-event-emitter, outvariant, is-node-process, etc.),
    // and new ones keep surfacing one at a time if allow-listed individually.
    // Transforming everything in node_modules avoids that entirely — the
    // trade-off (slightly slower test runs) is negligible for this project.
    transformIgnorePatterns: [],
    // Azure DevOps understands JUnit (test results) and Cobertura
    // (coverage) natively — these are only produced when running with
    // --coverage/--ci (see the `test:ci` script), not in local dev runs.
    coverageReporters: ["text", "cobertura", "html"],
    reporters: ["default", ["jest-junit", { outputDirectory: "reports", outputName: "junit.xml" }]],
  };
}

export default config;
