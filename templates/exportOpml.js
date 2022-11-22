import { html } from "../lib/html.js";

export default ({ site = {}, page = { title: "Profiles" }, profiles = [] }) => {
  return html`
    <?xml version="1.0" encoding="utf-8"?>
    <opml version="1.0">
      <head>
        <dateCreated>Tue, 22 Nov 2022 04:18:38 +0000</dateCreated>
        <title>${site.title}</title>
      </head>
      <body>
        <outline text="${site.title}" title="${site.title}">
          ${profiles.map(profileItem)}
        </outline>
      </body>
    </opml>
  `;
};

const profileItem = (profile) => {
  const { name, url, webfingerAddress, rssFeedUrl } = profile;

  const text = name ? `${name} (${webfingerAddress})` : webfingerAddress;
  
  return html`
    <outline
      type="rss"
      text="${text}"
      xmlUrl="${rssFeedUrl}"
      htmlUrl="${url}"
    />
  `;
};
