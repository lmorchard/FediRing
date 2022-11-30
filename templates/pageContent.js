import { html, unescaped } from "../lib/html.js";
import layoutPage from "./layoutPage.js";

export default (context) => {
  const { page, partials, content } = context;
  return layoutPage(
    context,
    html`
      <header>
        <h1>${page.title} - ${partials.title}</h1>
      </header>
      <article class="content-page">${unescaped(content)}</article>
    `
  );
};
