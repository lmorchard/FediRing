import { $ } from "./dom.js";

const THEME_CLASSNAME = "dark-theme";
const THEME_STORAGENAME = "pageTheme";

export function init() {
  set(fetch() == "dark");
}

export function domready() {
  $(".toggle-theme").addEventListener("click", toggle);
}

export function set(isDark = false) {
  classList()[!!isDark ? "add" : "remove"](THEME_CLASSNAME);
  store();
}

export function get() {
  return classList().contains(THEME_CLASSNAME);
}

export function toggle() {
  set(!get());
}

function classList() {
  return document.body.classList;
}

function fetch() {
  return window.localStorage.getItem(THEME_STORAGENAME);
}

function store() {
  window.localStorage.setItem(THEME_STORAGENAME, get() ? "dark" : "light");
}
