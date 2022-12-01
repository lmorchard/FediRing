import { html, unescaped } from "../lib/html.js";

export default (context) => {
  const {
    site = {},
    pages = {},
    page = { title: "Profiles" },
    partials = {},
    profiles = [],
  } = context;

  return html`
    <header>
      <h1><a href="${site.url}/">${partials.siteTitle}</a></h1>
      <nav>
        <ul>
          <li>
            <a href="${site.url}/">Home</a>
          </li>
          ${Object.entries(pages).map(
            ([name, item]) => html`
              <li>
                <a href="${site.url}/${name}.html">${item.data.title}</a>
              </li>
            `
          )}
          <li>
            <a href="${site.opmlUrl}" title="OPML export" class="opml"
              ><span>OPML</span></a
            >
          </li>
          <li>
            <button class="toggle-theme"><span>toggle theme</span></button>
          </li>
        </ul>
      </nav>
    </header>
  `;
};
