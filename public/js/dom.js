export const $ = (sel, context = document) =>
  typeof sel === "string" ? context.querySelector(sel) : sel;

export const $$ = (sel, context = document) =>
  Array.from(context.querySelectorAll(sel));
