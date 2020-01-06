const PROPNAME_REGEX = /(:|-)(.{1})/g;

export function toPropsString(properties, transformPropNames) {
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
