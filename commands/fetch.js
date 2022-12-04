import { parse as csvParse } from "csv-parse";
import * as fs from "fs";
import { PassThrough, Readable } from "stream";
import { writeFile, readFile } from "fs/promises";
import * as path from "path";
import { WebFinger } from "webfinger.js";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import mkdirp from "mkdirp";
import rmfr from "rmfr";
import copy from "recursive-copy";
import merge from "merge";
import { fetch } from "whatwg-fetch";
// import axios from "axios";
import PQueue from "p-queue";

import config from "../lib/config.js";
import { profileAddressToFilename } from "../lib/utils.js";

export default function init({ program }) {
  program
    .command("fetch")
    .description("fetch profiles")
    .option(
      "-f, --file <filename>",
      "fetch the profile list from a file in CSV format"
    )
    .option(
      "-f, --url <url>",
      "fetch the profile list from a URL in CSV format"
    )
    .option("-l, --limit <number>", "limit to <number> profiles in fetch")
    .option("-k, --keep", "do not delete downloaded profiles before fetching")
    .action(run);
}

async function run(options) {
  const { limit, keep } = options;

  if (!keep) await rmfr(profilesPath());
  await mkdirp(profilesPath());

  let { raw: csvContent, data: allProfiles } = await fetchCSV(options);

  await writeFile(path.join(config.DATA_PATH, "index.csv"), csvContent);

  // HACK: first line is column titles - maybe not always?
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

  clearInterval(timer);

  console.log(`Fetched ${result.length} profiles`);

  // HACK: force exit, because webfinger doesn't cancel its abort timers
  // https://github.com/silverbucket/webfinger.js/blob/master/src/webfinger.js#L159
  process.exit(0);
}

async function fetchCSV(options) {
  const { file, url } = options;

  let readStream;
  const fetchURL = url || config.FETCH_CSV_URL;
  if (fetchURL) {
    console.log("Fetching CSV URL", fetchURL);
    /* TODO: figure out why this option isn't actually giving me a stream in response.data?
    const response = await axios(fetchURL, { responseType: "stream" });
    readStream = response.data;
    */
    // HACK: shove the CSV resource into a Readable stream.
    const response = await fetch(fetchURL);
    readStream = new Readable();
    readStream.push(await response.text());
    readStream.push(null);
  } else {
    const filename =
      file ||
      config.FETCH_CSV_FILENAME ||
      path.join(config.CONTENT_PATH, "profiles.csv");
    if (filename) {
      console.log("Fetching CSV file", filename);
      readStream = fs.createReadStream(filename);
    }
  }

  if (!readStream) return [];

  const chunks = [];
  const capture = new PassThrough();
  capture.on("data", (chunk) => chunks.push(chunk));

  const data = await new Promise((resolve, reject) => {
    const parser = csvParse({}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
    readStream.pipe(capture).pipe(parser);
  });

  const raw = chunks.map((chunk) => chunk.toString()).join("");

  return { data, raw };
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
