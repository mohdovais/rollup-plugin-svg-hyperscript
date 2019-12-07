# rollup-plugin-svg-hyperscript

```javascript
import svgImport from "@ovais/rollup-plugin-svg-hyperscript";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "esm"
  },
  plugins: [
    svgImport()
  ]
};
```

```javascript
import svgImport from "@ovais/rollup-plugin-svg-hyperscript";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "esm"
  },
  plugins: [
    svgImport({
      importDeclaration: "import { h } from 'preact'",
      pragma: 'h',
      transformPropNames: false
    })
  ]
};
```
