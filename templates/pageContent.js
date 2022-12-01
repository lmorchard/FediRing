import { html, unescaped } from "../lib/html.js";
import layoutPage from "./layoutPage.js";

export default (context) => {
  const { page, partials, content } = context;
  return layoutPage(
    context,
    html`
      <article class="content-page inset">${unescaped(content)}</article>
    `
  );
};
