import { $, $$, metaContent } from "./dom.js";
import { throttle } from "./utils.js";

const SEARCH_THROTTLE = 100;
const SEARCH_MISS_CLASSNAME = "search-miss";

export async function init() {}

export async function domready() {
  $$("form.search").forEach((el) => {
    el.addEventListener("submit", (ev) => {
      ev.preventDefault();
    });
  });

  $$("form.search input[name=search]").forEach((el) => {
    el.addEventListener("input", onSearchChange);
  });
}

const onSearchChange = throttle((ev) => {
  const searchText = ev.target.value;

  $$("ul.profiles li.profile").forEach((profileEl) => {
    if (!searchText) {
      profileEl.classList.remove(SEARCH_MISS_CLASSNAME);
    }

    // Look through all elements marked as searchable and look for a hit
    let hit = false;
    for (const searchableEl of $$(".searchable", profileEl)) {
      if (
        findSearchMatch(searchText, searchableEl.textContent) ||
        findSearchMatch(searchText, searchableEl.getAttribute("title"))
      ) {
        hit = true;
        break;
      }
    }

    // Show / hide profile based on search hit.
    profileEl.classList[hit ? "remove" : "add"](SEARCH_MISS_CLASSNAME);
  });
}, SEARCH_THROTTLE);

function findSearchMatch(searchText, content) {
  // TODO: come up with a more interesting search algorithm
  const lcContent = ("" + content).toLowerCase();
  const lcSearchText = ("" + searchText).toLowerCase();
  return lcContent.includes(lcSearchText);
}
