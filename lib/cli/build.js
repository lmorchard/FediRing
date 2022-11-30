import * as path from "path";
import { writeFile, readFile } from "fs/promises";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { escape as qsEscape } from "querystring";
import { globbyStream } from "globby";
import matter from "gray-matter";
import * as commonmark from "commonmark";
import copy from "recursive-copy";
import mkdirp from "mkdirp";
import rmfr from "rmfr";

import config from "../config.js";
import { profileAddressToFilename as addressToFilename } from "../utils.js";

import pageIndex from "../../templates/pageIndex.js";
import pageProfile from "../../templates/pageProfile.js";
import pageContent from "../../templates/pageContent.js";
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
  const partials = await loadContentFiles("partials");
  const pages = await loadContentFiles("pages", true);

  const pageContext = {
    site,
    profiles,
    partials,
    pages,
  };

  await buildContentPages(pageContext);

  await writeFile(
    path.join(config.BUILD_PATH, "index.html"),
    pageIndex(pageContext)()
  );

  await writeFile(
    path.join(config.BUILD_PATH, "index.opml"),
    exportOpml(pageContext)()
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
      pageProfile({ ...pageContext, profile })()
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
  const profiles = [];
  const files = globbyStream(`${profilesPath()}/*.yaml`);

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

async function buildContentPages(pageContext) {
  const { pages } = pageContext;
  for (const [name, { content, data }] of Object.entries(pages)) {
    const contentPageHTML = pageContent({
      ...pageContext,
      page: { ...data, name },
      content,
    })();
    const contentPagePath = path.join(config.BUILD_PATH, `${name}.html`);
    await writeFile(contentPagePath, contentPageHTML);
  }
}

async function loadContentFiles(dirname, withFrontmatter) {
  const contentFiles = {};
  for (const [ext, loadFn] of contentFileTypes) {
    const files = globbyStream(`${config.CONTENT_PATH}/${dirname}/**/*.${ext}`);
    for await (const fn of files) {
      const { name } = path.parse(fn);
      const result = await loadFn(fn);
      contentFiles[name] = withFrontmatter ? result : result.content;
    }
  }
  return contentFiles;
}

const contentFileTypes = [
  ["txt", loadText],
  ["md", loadMarkdown],
];

async function loadText(fn) {
  const content = await readFile(fn);
  return { content: content.toString() };
}

async function loadMarkdown(fn) {
  const source = await readFile(fn);
  const { content: contentSrc, data } = matter(source);
  const mdParser = new commonmark.Parser();
  const mdHtmlRenderer = new commonmark.HtmlRenderer();
  const contentParsed = mdParser.parse(contentSrc);
  const content = mdHtmlRenderer.render(contentParsed);

  return { content, data };
}
