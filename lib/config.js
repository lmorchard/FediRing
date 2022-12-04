import * as dotenv from "dotenv";

const config = {};

export function init(context) {
  const { program } = context;
  dotenv.config();

  const {
    // Base public URL for the generated site
    SITE_URL = "",
    // Directory where customizable content should be found
    CONTENT_PATH = "./content",
    // Directory where the generated site will be built
    BUILD_PATH = "./build",
    // Directory where fetched profile data will be stored for build
    DATA_PATH = "./data",
    // URL where a CSV resource may be found - e.g. from a Google Sheets published CSV URL
    FETCH_CSV_URL,
    // Filename where a CSV resource may be found - e.g. `content/profiles.csv`
    FETCH_CSV_FILENAME,
    // How many profiles to fetch at the same time - higher is faster but more resource intensive
    FETCH_CONCURRENCY = 32,
    // How many ms to wait before giving up on resolving a profile address via webfinger
    WEBFINGER_TIMEOUT = 5000,
    // How many ms to wait before giving up on fetching a profile JSON resource
    PROFILE_FETCH_TIMEOUT = 5000,
    // Typically for Glitch hosting, this is the domain name of the project
    PROJECT_DOMAIN,
  } = process.env;
  
  let site_url = SITE_URL;
  if (!site_url && PROJECT_DOMAIN) {
    // HACK: use a glitch.me URL as default
    site_url = `https://${PROJECT_DOMAIN}.glitch.me`;
  }

  Object.assign(config, {
    VERSION: "1.0.0",
    SITE_URL: site_url,
    BUILD_PATH,
    DATA_PATH,
    CONTENT_PATH,
    FETCH_CONCURRENCY,
    FETCH_CSV_URL,
    FETCH_CSV_FILENAME,
    WEBFINGER_TIMEOUT,
    PROFILE_FETCH_TIMEOUT,
  });

  program.version(config.VERSION);

  context.config = config;
}

export default config;
