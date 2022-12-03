import * as path from "path";
import { writeFile, readFile } from "fs/promises";
import { parse as yamlParse } from "yaml";
import { globbyStream } from "globby";
import matter from "gray-matter";
import * as commonmark from "commonmark";
import copy from "recursive-copy";
import mkdirp from "mkdirp";
import rmfr from "rmfr";

import config from "../lib/config.js";
import { profileAddressToFilename as addressToFilename } from "../lib/utils.js";

export default function init({ program }) {
  program.command("build").description("build static site").action(run);
}

async function run() {
  const templates = await loadTemplates();

  const site = {
    title: config.SITE_TITLE,
    description: config.SITE_DESCRIPTION,
    url: config.SITE_URL,
    opmlUrl: `${config.SITE_URL}/index.opml`,
    csvUrl: `${config.SITE_URL}/index.csv`,
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

  await rmfr(config.BUILD_PATH);
  await mkdirp(config.BUILD_PATH);
  await copy(path.join(config.CONTENT_PATH, "public"), config.BUILD_PATH, {
    overwrite: true,
  });
  await copy(path.join(config.DATA_PATH, "index.csv"), "build/index.csv", {
    overwrite: true,
  });

  await buildContentPages(pageContext, templates);

  await writeFile(
    path.join(config.BUILD_PATH, "index.html"),
    templates.pageIndex(pageContext)()
  );

  await writeFile(
    path.join(config.BUILD_PATH, "index.opml"),
    templates.exportOpml(pageContext)()
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
      templates.pageProfile({ ...pageContext, profile })()
    );
  }
}

const TEMPLATE_NAMES = [
  "pageIndex",
  "pageProfile",
  "pageContent",
  "exportOpml",
];

async function loadTemplates() {
  const templatesPath = path.resolve(
    path.join(config.CONTENT_PATH, "templates")
  );
  const templates = {};
  for (const name of TEMPLATE_NAMES) {
    const templatePath = path.join(templatesPath, `${name}.js`);
    const module = await import(templatePath);
    templates[name] = module.default;
  }
  return templates;
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

async function buildContentPages(pageContext, templates) {
  const { pages } = pageContext;
  for (const [name, { content, data }] of Object.entries(pages)) {
    const contentPageHTML = templates.pageContent({
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
  for (const [ext, loadFn] of CONTENT_FILE_TYPES) {
    const files = globbyStream(`${config.CONTENT_PATH}/${dirname}/**/*.${ext}`);
    for await (const fn of files) {
      const { name } = path.parse(fn);
      const result = await loadFn(fn);
      contentFiles[name] = withFrontmatter ? result : result.content;
    }
  }
  return contentFiles;
}

const CONTENT_FILE_TYPES = [
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
