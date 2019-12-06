const path = require("path");
const rollup = require("rollup");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const requireFromString = require("require-from-string");
const svg = require("../src/main");

const inputOptions = {
  input: path.resolve(__dirname, "./main.js"),
  external: ["react"],
  plugins: [svg()]
};

const outputOptions = {
  format: "cjs",
  globals: {
    React: "react"
  }
};

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const result = output[0];
  //console.log(output);
  //console.log(result.type);
  //console.log(result.imports);
  //console.log(result.exports);
  console.log(result.code);
  //console.log(path.resolve("./", "./react-log.svg"));
  return requireFromString(result.code, path.resolve(__dirname, "./logo.js"));
}

build().then(
  Element => {
    console.log(renderToStaticMarkup(React.createElement(Element)));
  },
  error => console.error(error)
);
