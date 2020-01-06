import { readFileSync } from 'fs';
import { createFilter } from 'rollup-pluginutils';
import { basename } from 'path';
import { parse } from 'svg-parser';

const PROPNAME_REGEX = /(:|-)(.{1})/g;

function toPropsString(properties, transformPropNames) {
  const keys = Object.keys(properties);
  const transformKey = transformPropNames !== false;

  return keys.length === 0
    ? "null"
    : JSON.stringify(
        Object.keys(properties).reduce(function(accum, key) {
          const transformedKey =
            transformKey && !key.startsWith("aria-")
              ? key.replace(PROPNAME_REGEX, x => x.slice(1).toUpperCase())
              : key;
          accum[transformedKey] = properties[key];
          return accum;
        }, {})
      );
}

function createElement(object, pragma, transformKeys) {
  const { type, tagName, properties, children } = object;
  const props = toPropsString(properties, transformKeys);
  const ch = createChildren(children, pragma);

  return type === "element"
    ? `${pragma}("${tagName}", ${props}, ${ch})`
    : null;
}

function createChildren(children, pragma, transformKeys) {
  switch (children.length) {
    case 0:
      return "null";
    case 1:
      return createElement(children[0], pragma, transformKeys);
    default:
      return children.map(child => createElement(child, pragma, transformKeys));
  }
}

function toClassName(string) {
  return basename(string, ".svg")
    .replace(/[^a-zA-Z0-9].?/g, x => x.slice(1).toUpperCase());
}

function getSVG(object) {
    const { type, tagName, children } = object;
  
    if (type === "element" && tagName === "svg") {
      return object;
    }
  
    for (let i = 0, l = children.length; i < l; i++) {
      const child = getSVG(children[i]);
      if (child !== undefined) {
        return child;
      }
    }
  }

function parseSVG(string) {
  return getSVG(parse(string));
}

function importSVG(config) {
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
        const svg = parseSVG(readFileSync(id, "utf8"));
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

export default importSVG;
