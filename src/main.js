const fs = require("fs");
const path = require("path");
const { parse } = require("svg-parser");
const { createFilter } = require("rollup-pluginutils");

const PROPNAME_REGEX = /(:|-)(.{1})/g;

function toPropsString(properties) {
  const keys = Object.keys(properties);
  return keys.length === 0
    ? "null"
    : JSON.stringify(
        Object.keys(properties).reduce(function(accum, key) {
          accum[key.replace(PROPNAME_REGEX, x => x.slice(1).toUpperCase())] =
            properties[key];
          return accum;
        }, {})
      );
}

function createElement(object) {
  const { type, tagName, properties, children } = object;
  return type === "element"
    ? `h("${tagName}", ${toPropsString(properties)}, ${createChildren(
        children
      )})`
    : null;
}

function createChildren(array) {
  switch (array.length) {
    case 0:
      return "null";
    case 1:
      return createElement(array[0]);
    default:
      return array.map(createElement);
  }
}

function toClassName(string) {
  return path
    .basename(string, ".svg")
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

module.exports = function(config = {}) {
  const { include, exclude } = config;
  const includeExcludeFilter = createFilter(include, exclude);
  const filter = id => /\.svg$/.test(id) && includeExcludeFilter(id);
  const pragma = "React.createElement";
  let file;

  // React
  // createElement

  return {
    name: "rollup-plugin-react-svg",
    resolveId(source, caller) {
      if (filter(source)) {
        file = path.normalize(path.dirname(caller) + "/" + source);
      }
      return null;
    },
    load(id) {
      if (filter(id)) {
        const fileContent = fs.readFileSync(file, "utf8");
        const parsed = parse(fileContent);
        const svg = getSVG(parsed);
        const defaultProps = toPropsString(svg.properties);
        const componentName = toClassName(id);

        return `
import React from 'react';
const h = ${pragma};
export default function ${componentName}(props){
  return h('svg', props, ${createChildren(svg.children)});
}
${componentName}.defaultProps = ${defaultProps};
`;
      }
      return null;
    }
  };
};
