import { toPropsString } from "./props";

function createElement(object, pragma) {
  const { type, tagName, properties, children } = object;
  const props = toPropsString(properties);
  const ch = createChildren(children, pragma);

  return type === "element"
    ? `${pragma}("${tagName}", ${props}, ${ch})`
    : null;
}

export function createChildren(children, pragma) {
  switch (children.length) {
    case 0:
      return "null";
    case 1:
      return createElement(children[0], pragma);
    default:
      return children.map(child => createElement(child, pragma));
  }
}
