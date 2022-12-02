import { parse as csvParse } from "csv-parse";
import * as fs from "fs";
import { writeFile, readFile } from "fs/promises";
import * as path from "path";
import { WebFinger } from "webfinger.js";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import mkdirp from "mkdirp";
import copy from "recursive-copy";
import merge from "merge";
import { fetch } from "whatwg-fetch";
import PQueue from "p-queue";

import config from "../config.js";
import { profileAddressToFilename } from "../utils.js";

export default function init({ program }) {
  program
    .command("fetch")
    .description("fetch profiles")
    .argument("<filename>", "name of the CSV file to fetch")
    .option("-l, --limit <number>", "limit to <number> profiles in fetch")
    .action(run);
}

async function run(filename, options) {
  const { limit } = options;

  await mkdirp(profilesPath());
  await copy(filename, path.join(config.DATA_PATH, "index.csv"), {
    overwrite: true,
  });

  let allProfiles = await loadCSV(filename);
  allProfiles.shift();
  if (limit) {
    allProfiles = allProfiles.slice(0, limit);
  }

  const timer = setInterval(
    () => console.log(`Queue pending = ${queue.pending} size = ${queue.size}`),
    1000
  );

  const queue = new PQueue({
    concurrency: config.FETCH_CONCURRENCY,
  });

  const result = await queue.addAll(
    allProfiles.map(([addr, ...rest]) => async () => {
      console.log(`Fetching ${addr}`);
      try {
        const fn = await fetchProfile(addr);
        console.log(`Wrote ${fn}`);
        return fn;
      } catch (e) {
        console.log(`Failed ${addr}`);
        console.error(e);
      }
    })
  );

  //await queue.onIdle();

  clearInterval(timer);

  console.log(`Fetched ${result.length} profiles`);

  // HACK: force exit, because webfinger doesn't cancel its abort timers
  // https://github.com/silverbucket/webfinger.js/blob/master/src/webfinger.js#L159
  process.exit(0);
}

async function fetchProfile(addr) {
  const { object: { links = [] } = {} } = await fetchWebfinger(addr);

  const selfLink = links.find((link) => link.rel == "self");
  if (!selfLink) return;

  const abortController = new AbortController();
  const abortTimer = setTimeout(
    () => abortController.abort(),
    config.PROFILE_FETCH_TIMEOUT
  );
  const resp = await fetch(selfLink.href, {
    signal: abortController.signal,
    headers: { Accept: "application/json" },
  });
  clearTimeout(abortTimer);

  const actorFn = profileAddressToFilename(addr);
  const yamlPath = path.join(profilesPath(), `${actorFn}.yaml`);

  let existingData;
  try {
    const existingYaml = await readFile(yamlPath);
    existingData = yamlParse(existingYaml.toString());
  } catch (e) {
    existingData = {};
  }

  const actorData = await resp.json();
  actorData.webfingerAddress = addr;
  delete actorData["@context"];
  delete actorData.publicKey;
  actorData.fetchedAt = new Date().toISOString();

  const yamlData = merge(existingData, actorData);
  const actorYaml = yamlStringify(yamlData);
  await writeFile(yamlPath, actorYaml);
  return yamlPath;
}

const profilesPath = () => path.join(config.DATA_PATH, "profiles");

const loadCSV = (filename) =>
  new Promise((resolve, reject) => {
    const parser = csvParse({}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
    fs.createReadStream(filename).pipe(parser);
  });

const fetchWebfinger = (
  addr,
  options = {
    request_timeout: config.WEBFINGER_TIMEOUT,
  }
) =>
  new Promise((resolve, reject) => {
    new WebFinger(options).lookup(addr, (err, p) => {
      if (err) reject(err);
      else resolve(p);
    });
  });
