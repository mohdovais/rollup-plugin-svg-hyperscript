import * as fs from "fs";
import { createFilter } from "rollup-pluginutils";

import { toPropsString } from "./props";
import { createChildren } from "./hyper";
import { toClassName } from "./classname";
import { parseSVG } from "./parse-svg";

export default function importSVG(config) {
  const {
    include,
    exclude,
    importDeclaration,
    pragma,
    transformPropNames
  } = Object.assign(
    {
      importDeclaration: "import React from 'react'",
      pragma: "React.createElement"
    },
    config
  );
  const includeExcludeFilter = createFilter(include, exclude);
  const filter = id => /\.svg$/.test(id) && includeExcludeFilter(id);
  const transformKeys = transformPropNames !== false;

  return {
    name: "rollup-plugin-svg-hyperscript",
    load(id) {
      if (filter(id)) {
        const svg = parseSVG(fs.readFileSync(id, "utf8"));
        const defaultProps = toPropsString(svg.properties, transformKeys);
        const componentName = toClassName(id);

        return `
${importDeclaration};
export default function ${componentName}(props){
  return ${pragma}('svg', props, ${createChildren(svg.children, pragma, transformKeys)});
}
${componentName}.defaultProps = ${defaultProps};
`;
      }
      return null;
    }
  };
}
