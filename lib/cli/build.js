import * as fs from "fs";
import * as path from "path";
import { writeFile, readFile } from "fs/promises";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { escape as qsEscape } from "querystring";
import { globbyStream } from "globby";
import copy from "recursive-copy";
import mkdirp from "mkdirp";
import rmfr from "rmfr";

import config from "../config.js";
import { profileAddressToFilename as addressToFilename } from "../utils.js";

import pageIndex from "../../templates/pageIndex.js";
import pageProfile from "../../templates/pageProfile.js";
import exportOpml from "../../templates/exportOpml.js";

export default function init({ program }) {
  program.command("build").description("build static site").action(run);
}

async function run() {
  await rmfr(config.BUILD_PATH);
  await mkdirp(config.BUILD_PATH);
  await copy("public", "build");

  const site = {
    title: config.SITE_TITLE,
    description: config.SITE_DESCRIPTION,
    url: config.SITE_URL,
    opmlUrl: `${config.SITE_URL}/index.opml`,
  };

  const profiles = await loadProfiles({ site });

  await writeFile(
    path.join(config.BUILD_PATH, "index.html"),
    pageIndex({ site, profiles })()
  );

  await writeFile(
    path.join(config.BUILD_PATH, "index.opml"),
    exportOpml({ site, profiles })()
  );

  const minimizedProfiles = profiles.map(
    ({ webfingerAddress, name, url, localProfileUrl }) => ({
      url,
      name,
      localProfileUrl,
      webfingerAddress,
    })
  );

  await writeFile(
    path.join(config.BUILD_PATH, "index.json"),
    JSON.stringify(minimizedProfiles, null, "  ")
  );

  await mkdirp(profilePagesPath());

  for (const profile of profiles) {
    const pagePath = profilePagePath(profile);
    await mkdirp(pagePath);
    await writeFile(
      path.join(pagePath, "index.html"),
      pageProfile({ site, profile })()
    );
  }
}

const profilesPath = () => path.join(config.DATA_PATH, "profiles");

const profilePagesPath = () => path.join(config.BUILD_PATH, "profiles");

const profilePagePath = (profile) => {
  const { webfingerAddress } = profile;
  return path.join(profilePagesPath(), addressToFilename(webfingerAddress));
};

async function loadProfiles({ site }) {
  const files = globbyStream(`${profilesPath()}/*.yaml`);
  const profiles = [];

  for await (const fn of files) {
    const yaml = await readFile(fn);
    const profile = yamlParse(yaml.toString());
    if (!profile.url) continue;

    profiles.push({
      ...profile,
      localProfileUrl: `${site.url}/profiles/${addressToFilename(
        profile.webfingerAddress
      )}/index.html`,
      rssFeedUrl: `${profile.url}.rss`,
    });
  }
  return profiles;
}
