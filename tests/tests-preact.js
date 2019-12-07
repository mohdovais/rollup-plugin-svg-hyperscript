// node internals
const assert = require("assert");

// node modules
const { h } = require("preact");
const render = require("preact-render-to-string");

const importSVG = require("../dist/rollup-plugin-svg-hyperscript.cjs");
const {
  build,
  resolve,
  SNAPSOT_01,
  SNAPSOT_02,
  describe
} = require("./common");

const inputOptions = function(options) {
  return Object.assign(
    {
      external: ["preact"],
      plugins: [
        importSVG({
          importDeclaration: "import { h } from 'preact'",
          pragma: "h",
          transformPropNames: false
        })
      ]
    },
    options
  );
};

describe(
  "Preact should render component",
  build(
    inputOptions({
      input: resolve("./preact-component")
    })
  ).then(element => {
    const markup = render(h(element));
    assert.ok(markup === SNAPSOT_01, "Preact should render component");
  })
);

describe(
  "Preact should render direct SVG entry",
  build(
    inputOptions({
      input: resolve("./svg/react-logo.svg")
    })
  ).then(element => {
    const markup = render(h(element));
    assert.ok(markup === SNAPSOT_01, "Preact should render direct SVG entry");
  })
);

describe(
  "Preact should render with props passed",
  build(
    inputOptions({
      input: resolve("./preact-component")
    })
  ).then(element => {
    const markup = render(
      h(element, { id: null, x: null, y: null, width: 300, height: 300 }, null)
    );
    assert.ok(markup === SNAPSOT_02, "Preact should render with props passed");
  })
);
