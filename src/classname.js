import * as path from "path";

export function toClassName(string) {
  return path
    .basename(string, ".svg")
    .replace(/[^a-zA-Z0-9].?/g, x => x.slice(1).toUpperCase());
}

