import { defineConfig } from "vite";
import jahia from "@jahia/vite-plugin";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));
const reactJsxRuntimeAlias = resolve(rootDir, "src/polyfills/react-jsx-runtime.ts");

export default defineConfig({
  resolve: {
    alias: {
      "react/jsx-runtime": reactJsxRuntimeAlias,
      "react/jsx-dev-runtime": reactJsxRuntimeAlias,
      "~": resolve(rootDir, "src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    jahia({
      // Default values:
      inputDir: "src",
      outputDir: "dist",
      assetsDir: "assets",
      client: {
        inputGlob: "**/*.client.{ts,tsx,jsx}",
        outputDir: "client",
      },
      server: {
        inputGlob: "**/*.server.{jsx,tsx}",
        outputFile: "server/index.js",
        rollupOptions: {
          output: {
            format: "cjs",
            exports: "auto",
            interop: "auto",
          },
        },
      },

      // This function is called every time a build succeeds in watch mode
      watchCallback() {
        spawnSync("yarn", ["watch:callback"], { stdio: "inherit", shell: true });
      },
    }),
  ],
});
