import { html } from "../../lib/html.js";
import partialHeader from "./partialHeader.js";

export default (context, content) => {
  const { site = {}, partials = {}, page = {}, head = "" } = context;
  return html`
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <title>${page.title} - ${partials.siteTitle}</title>
        <meta
          property="og:site_name"
          content="${page.title} - ${partials.siteTitle}"
        />
        <meta property="og:type" content="article" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta property="profiles-index" content="${site.url}/index.json" />
        <link rel="stylesheet" href="${site.url}/index.css" />
        <script type="module" src="${site.url}/js/index.js"></script>
        ${head}
      </head>
      <body class="page-center dark-theme ${page.className}">
        ${partialHeader(context)} ${content}
        ${site.isGlitch &&
        html`
          <div
            class="glitchButton position-x-right position-y-top"
            style="z-index: 5;"
          ></div>
          <script src="https://button.glitch.me/button.js"></script>
        `}
      </body>
    </html>
  `;
};
