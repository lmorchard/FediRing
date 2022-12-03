import * as dotenv from "dotenv";

const config = {};

export function init(context) {
  const { program } = context;
  dotenv.config();

  const {
    SITE_TITLE,
    SITE_URL = "",
    BUILD_PATH = "./build",
    DATA_PATH = "./data",
    CONTENT_PATH = "./content",
    PUBLIC_PATH = "./public",
    TEMPLATES_PATH = "./templates",
    FETCH_CONCURRENCY = 16,
    WEBFINGER_TIMEOUT = 5000,
    PROFILE_FETCH_TIMEOUT = 5000,
    PROJECT_DOMAIN,
  } = process.env;
  
  let site_url = SITE_URL;
  if (!site_url && PROJECT_DOMAIN) {
    // HACK: use a glitch.me URL as default
    site_url = `https://${PROJECT_DOMAIN}.glitch.me`;
  }

  Object.assign(config, {
    VERSION: "0.0.1",
    SITE_URL: site_url,
    SITE_TITLE,
    BUILD_PATH,
    DATA_PATH,
    CONTENT_PATH,
    PUBLIC_PATH,
    TEMPLATES_PATH,
    FETCH_CONCURRENCY,
    WEBFINGER_TIMEOUT,
    PROFILE_FETCH_TIMEOUT,
  });

  program.version(config.VERSION);

  context.config = config;
}

export default config;
