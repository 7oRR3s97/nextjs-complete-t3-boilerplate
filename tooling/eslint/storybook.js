import refreshPlugin from "eslint-plugin-react-refresh";
import storybookPlugin from "eslint-plugin-storybook";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      storybook: storybookPlugin,
      "react-refresh": refreshPlugin,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
];
