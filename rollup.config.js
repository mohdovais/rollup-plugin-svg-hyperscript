export default [
  {
    input: "src/main.js",
    output: {
      file: "dist/rollup-plugin-svg-hyperscript.cjs.js",
      format: "cjs"
    },
    external: ["fs", "path", "rollup-pluginutils", "svg-parser"]
  },
  {
    input: "src/main.js",
    output: {
      file: "dist/rollup-plugin-svg-hyperscript.esm.js",
      format: "esm"
    },
    external: ["fs", "path", "rollup-pluginutils", "svg-parser"]
  }
];
