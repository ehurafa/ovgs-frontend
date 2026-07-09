import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // React Compiler is explicitly NOT enabled in this project (see
  // README "Architectural Decisions"), so lint warnings that only
  // matter when the compiler is active are noise here, not real bugs.
  {
    rules: {
      "react-hooks/incompatible-library": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Must come after nextVitals/nextTs — disables ESLint's stylistic
  // rules so Prettier is the single source of truth for formatting.
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
