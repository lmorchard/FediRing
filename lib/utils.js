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
  // qsEscape(addr);

export const webfingerAddressWithBreak = (addr) => addr.replace("@", "\u200b@");
