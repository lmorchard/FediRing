import { $, $$ } from "./dom.js";
import PageTheme from "./pageTheme.js";

async function main() {
  PageTheme.init();

  $(".toggle-theme").addEventListener("click", () => PageTheme.toggle());
}

document.addEventListener("DOMContentLoaded", () =>
  main()
    .then(() => console.log("READY."))
    .catch((err) => console.error(err))
);
