import baseConfig from "@monorepo/eslint-config/base";
import reactConfig from "@monorepo/eslint-config/react";
import storybookConfig from "@monorepo/eslint-config/storybook";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
  ...storybookConfig,
];
