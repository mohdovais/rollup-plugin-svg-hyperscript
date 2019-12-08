# rollup-plugin-svg-hyperscript

Rollup plugin to import `.svg` files as React(_like_) component. 

The plugin transforms SVG content to hyperscript (React.createElement) based functional component __not JSX__

```xml
<!-- rainbow.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 28 28">
    <circle r="14" fill="#f00"/>
    <circle r="12" fill="#ff7f00"/>
    <circle r="10" fill="#ff0"/>
    <circle r="8" fill="#0f0"/>
    <circle r="6" fill="#00f"/>
    <circle r="4" fill="#2E2B5F" />
    <circle r="2" fill="#8B00FF" />
</svg>
```

```javascript
// transformed import
import React from "react";

export default function rainbow(props) {
  return React.createElement(
    "svg",
    props,
    React.createElement("circle", { r: 14, fill: "#f00" }, null),
    React.createElement("circle", { r: 12, fill: "#ff7f00" }, null),
    React.createElement("circle", { r: 10, fill: "#ff0" }, null),
    React.createElement("circle", { r: 8, fill: "#0f0" }, null),
    React.createElement("circle", { r: 6, fill: "#00f" }, null),
    React.createElement("circle", { r: 4, fill: "#2e2b5f" }, null),
    React.createElement("circle", { r: 2, fill: "#8b00ff" }, null)
  );
}
rainbow.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "-14 -14 28 28"
}
```

## Installation

```shell
npm install --save-dev rollup-plugin-svg-hyperscript
```

## Usage

By default plugin uses React.createElement and transform properties to camelCase.

```javascript
// rollup.config.js
import svgImport from "rollup-plugin-svg-hyperscript";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "esm"
  },
  plugins: [svgImport()]
};
```

```javascript
// components/header.jsx
import React from 'react';
import Logo from './company-logo.svg';

export function(props){
  return (
    <header>
      <Logo width={32} height={32} />
      <h1>{props.compnayName}</h1>
    </header>
  );
}
```

## Configurations

```javascript
// rollup.config.js
import svgImport from "rollup-plugin-svg-hyperscript";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "esm"
  },
  plugins: [
    svgImport({
      // import declaration for element renderer
      importDeclaration: "import { h } from 'preact'", // Default: "import React from 'react'"

      // Pragma to create element, by default it uses React.createElement
      pragma: "h", // Default: "React.createElement",

      // React requires all properties and attributes in camelCase, e.g. 
      // xmlns:xlink should be provided as xmlnsXlink 
      // and enable-background as enabelBackground.
      // Whereas Preact has raw HTML attribute/property names support and 
      // transformation is not needed.
      // https://preactjs.com/guide/v10/differences-to-react/#raw-html-attributeproperty-names
      transformPropNames: false // Default: true
    })
  ]
};
```
