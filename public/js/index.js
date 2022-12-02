import * as PageTheme from "./pageTheme.js";
import * as ProfilesNavigation from "./profilesNavigation.js";
import * as ProfileVerification from "./profileVerification.js";
import * as ProfileSearch from "./profileSearch.js";

const modules = [PageTheme, ProfilesNavigation, ProfileVerification, ProfileSearch];

async function init() {
  console.log(`LOAD "*", 8, 1`);

  document.addEventListener("DOMContentLoaded", () =>
    domready()
      .then(() => console.log("READY."))
      .catch((err) => console.error(err))
  );

  for (const module of modules) {
    module.init();
  }
}

async function domready() {
  for (const module of modules) {
    module.domready();
  }
}

init().catch((err) => console.error(err));
