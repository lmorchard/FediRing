import * as dotenv from "dotenv";

const config = {};

export function init(context) {
  const { program } = context;
  dotenv.config();

  const {
    SITE_TITLE,
    SITE_DESCRIPTION,
    SITE_URL = "",
    BUILD_PATH = "./build",
    DATA_PATH = "./data",
    FETCH_CONCURRENCY = 16,
    WEBFINGER_TIMEOUT = 5000,
    PROFILE_FETCH_TIMEOUT = 5000,
  } = process.env;

  Object.assign(config, {
    VERSION: "0.0.1",
    SITE_TITLE,
    SITE_DESCRIPTION,
    SITE_URL,
    BUILD_PATH,
    DATA_PATH,
    FETCH_CONCURRENCY,
    WEBFINGER_TIMEOUT,
    PROFILE_FETCH_TIMEOUT,
  });

  program.version(config.VERSION);

  context.config = config;
}

export default config;
