import { escape as qsEscape } from "querystring";

// https://stackoverflow.com/a/48032528
export async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export const profileAddressToFilename = (addr) => addr.replace("@", "_");

export const webfingerAddressWithBreak = (addr) => addr.replace("@", "\u200b@");

export function replaceVariablesInContent(content, variables = {}) {
  let out = content;
  for (const [name, value] of Object.entries(variables)) {
    // Substitute ${name}
    out = out.replace(new RegExp(`\\$\\{${name}\\}`, "g"), value);
    // Substitute ${name} but URL encoded
    out = out.replace(new RegExp(`\\$%7B${name}%7D`, "g"), encodeURI(value));
  }
  return out;
}

export const mapObjectValues = (object, fn) =>
  Object.entries(object).reduce(
    (acc, [name, value]) => ({ ...acc, [name]: fn(value, name) }),
    {}
  );
