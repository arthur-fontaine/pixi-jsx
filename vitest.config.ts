import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "transform",
    jsxDev: false,
    jsxImportSource: "pixi-jsx",
    jsxInject: `import { jsx } from 'pixi-jsx/jsx-runtime'`,
    jsxFactory: "jsx.fragment",
  },
});
