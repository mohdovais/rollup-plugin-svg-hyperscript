import { parse } from "svg-parser";

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

export function parseSVG(string) {
  return getSVG(parse(string));
}

