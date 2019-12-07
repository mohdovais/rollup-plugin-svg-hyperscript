// node internals
const path = require("path");
const fs = require("fs");

// node modules
const rollup = require("rollup");
const requireFromString = require("require-from-string");

const SNAPSOT_01 = fs.readFileSync(
  resolve("./snapshots/react-logo-01.svg"),
  "utf8"
);

const SNAPSOT_02 = fs.readFileSync(
  resolve("./snapshots/react-logo-02.svg"),
  "utf8"
);

async function build(inputOptions, outputOptions) {
  outputOptions = Object.assign(
    {
      format: "cjs",
      globals: {
        Preact: "preact",
        React: "react"
      }
    },
    outputOptions
  );

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  return requireFromString(output[0].code);
}

function resolve(relativePath) {
  return path.resolve(__dirname, relativePath);
}

function describe(message, promise){
  console.time(message);
  promise.then(() => console.timeEnd(message)).catch(console.error);
}

module.exports.build = build;
module.exports.resolve = resolve;
module.exports.SNAPSOT_01 = SNAPSOT_01;
module.exports.SNAPSOT_02 = SNAPSOT_02;
module.exports.describe = describe;