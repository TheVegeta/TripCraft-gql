const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const esbuildPluginTsc = require("esbuild-plugin-tsc");

(async () => {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "lib/build.js",
    platform: "node",
    minifySyntax: true,
    minifyIdentifiers: true,
    minifyWhitespace: false,
    treeShaking: true,
    sourcemap: true,
    drop: ["debugger"],
    plugins: [
      nodeExternalsPlugin(),
      esbuildPluginTsc({ tsconfigPath: "./tsconfig.json" }),
    ],
    target: ["node11.15.0"],
  });
})();
