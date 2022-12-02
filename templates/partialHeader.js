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
          <li class="home-link">
            <a href="${site.url}/">Home 🏠</a>
          </li>
          ${Object.entries(pages).map(
            ([name, item]) => html`
              <li class="page-link">
                <a href="${site.url}/${name}.html">${item.data.title} 📃</a>
              </li>
            `
          )}
          <li>
            <a href="${site.csvUrl}" title="CSV export" class="format-icon csv"
              ><span>Profiles</span></a
            >
          </li>
          <li>
            <a
              href="${site.opmlUrl}"
              title="OPML export"
              class="format-icon opml"
              ><span>Feeds</span></a
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
