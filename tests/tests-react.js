// node internals
const assert = require("assert");

// node modules
const React = require("react");
const { renderToStaticMarkup: render } = require("react-dom/server");

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
      external: ["react"],
      plugins: [importSVG()]
    },
    options
  );
};

const h = React.createElement;

describe(
  "React should render component",
  build(
    inputOptions({
      input: resolve("./react-component")
    })
  ).then(element => {
    const markup = render(h(element));
    assert.ok(markup === SNAPSOT_01, "React should render component");
  })
);

describe(
  "React should render direct SVG entry",
  build(
    inputOptions({
      input: resolve("./svg/react-logo.svg")
    })
  ).then(element => {
    const markup = render(h(element));
    assert.ok(markup === SNAPSOT_01, "React should render direct SVG entry");
  })
);

describe(
  "React should render with props passed",
  build(
    inputOptions({
      input: resolve("./react-component")
    })
  ).then(element => {
    const markup = render(
      h(element, { id: null, x: null, y: null, width: 300, height: 300 }, null)
    );
    assert.ok(markup === SNAPSOT_02, "React should render with props passed");
  })
);
