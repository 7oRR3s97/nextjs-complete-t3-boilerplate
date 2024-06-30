import baseConfig from "@monorepo/eslint-config/base";
import nextjsConfig from "@monorepo/eslint-config/nextjs";
import reactConfig from "@monorepo/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
];
