import { $, $$, metaContent } from "./dom.js";
import { throttle } from "./utils.js";

const SEARCH_THROTTLE = 250;

export async function init() {
}

export async function domready() {
  $$("form.search").forEach((el) => {
    el.addEventListener("submit", () => el.preventDefault());
  });

  $$("form.search input[name=search]").forEach((el) => {
    el.addEventListener("input", onSearchChange);
  });
}

const onSearchChange = throttle((ev) => {
  const searchText = ev.target.value;
  console.log("SEARCH CHANGE", searchText);

  $$("ul.profiles li.profile").forEach(profileEl => {
    let hit = false;
    if (searchText === "") {
      hit = true;
    } else {
      $$(".searchable", profileEl).forEach(searchableEl => {
        const content = "" + searchableEl.textContent;
        if (content.includes(searchText)) {
          hit = true;
        }
      });
    }

    profileEl.classList[hit ? "remove" : "add"]("search-miss");
  });

}, SEARCH_THROTTLE);
