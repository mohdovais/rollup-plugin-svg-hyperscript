'use strict';

var fs = require('fs');
var path = require('path');
var rollupPluginutils = require('rollup-pluginutils');
var svgParser = require('svg-parser');

const PROPNAME_REGEX = /(:|-)(.{1})/g;

function toPropsString(properties, transformPropNames) {
  const keys = Object.keys(properties);
  const transformKey = transformPropNames !== false;

  return keys.length === 0
    ? "null"
    : JSON.stringify(
        Object.keys(properties).reduce(function(accum, key) {
          const transformedKey = transformKey
            ? key.replace(PROPNAME_REGEX, x => x.slice(1).toUpperCase())
            : key;
          accum[transformedKey] = properties[key];
          return accum;
        }, {})
      );
}

function createElement(object, pragma) {
  const { type, tagName, properties, children } = object;
  const props = toPropsString(properties);
  const ch = createChildren(children, pragma);

  return type === "element"
    ? `${pragma}("${tagName}", ${props}, ${ch})`
    : null;
}

function createChildren(children, pragma) {
  switch (children.length) {
    case 0:
      return "null";
    case 1:
      return createElement(children[0], pragma);
    default:
      return children.map(child => createElement(child, pragma));
  }
}

function toClassName(string) {
  return path.basename(string, ".svg")
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
  return getSVG(svgParser.parse(string));
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
  const includeExcludeFilter = rollupPluginutils.createFilter(include, exclude);
  const filter = id => /\.svg$/.test(id) && includeExcludeFilter(id);
  let file;

  return {
    name: "rollup-plugin-svg-hyperscript",
    resolveId(source, caller) {
      if (filter(source)) {
        file =
          typeof caller === "string" // `caller` will be undefined if svg is direct input
            ? path.normalize(path.resolve(path.dirname(caller), source))
            : source;
      }
      return null;
    },
    load(id) {
      if (filter(id)) {
        const svg = parseSVG(fs.readFileSync(file, "utf8"));
        const defaultProps = toPropsString(svg.properties, transformPropNames);
        const componentName = toClassName(id);

        return `
${importDeclaration};
export default function ${componentName}(props){
  return ${pragma}('svg', props, ${createChildren(svg.children, pragma)});
}
${componentName}.defaultProps = ${defaultProps};
`;
      }
      return null;
    }
  };
}

module.exports = importSVG;
