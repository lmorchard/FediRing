import * as fs from "fs";
import * as path from "path";
import { writeFile, readFile } from "fs/promises";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { globbyStream } from "globby";
import copy from "recursive-copy";
import mkdirp from "mkdirp";
import rmfr from "rmfr";

import config from "../config.js";
import pageIndex from "../../templates/pageIndex.js";

export default function init({ program }) {
  program.command("build").description("build static site").action(run);
}

async function run() {
  await rmfr(config.BUILD_PATH);
  await mkdirp(config.BUILD_PATH);
  await copy("public", "build");

  const profiles = await loadProfiles();

  await mkdirp(profilePagesPath());

  await writeFile(
    path.join(config.BUILD_PATH, "index.html"),
    pageIndex({
      site: {
        title: config.SITE_TITLE,
      },
      profiles
    })()
  );

  /*
  for (const profile of profiles) {
    console.log(profile.name, profile.preferredUsername);
  }
  */
}

const profilesPath = () => path.join(config.DATA_PATH, "profiles");

const profilePagesPath = () => path.join(config.BUILD_PATH, "profiles");

const profileAddressToFilename = (addr) => qsEscape(addr);

async function loadProfiles() {
  const files = globbyStream(`${profilesPath()}/*.yaml`);
  const profiles = [];
  for await (const fn of files) {
    const yaml = await readFile(fn);
    const profile = yamlParse(yaml.toString());
    profiles.push(profile);
  }
  return profiles;
}
