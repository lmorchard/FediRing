#!/usr/bin/env node
import { Command } from "commander";

import config, { init as initConfig } from "./lib/config.js";
import initFetch from "./cli/fetch.js";
import initBuild from "./cli/build.js";

const program = new Command();
const context = { program };
[initConfig, initFetch, initBuild].forEach((fn) => fn(context));

async function main() {
  await program.parseAsync(process.argv);
}

main().catch((err) => console.error(err));
