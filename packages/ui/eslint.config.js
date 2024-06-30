import baseConfig from "@monorepo/eslint-config/base";
import reactConfig from "@monorepo/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
