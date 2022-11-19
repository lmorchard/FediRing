import { html } from "../lib/html.js";

export default (
  { site = {}, page = {}, head = "", js = "" },
  content
) => html`
  <!DOCTYPE html>
  <html lang="en-us">
    <head>
      <title>${page.title} - ${site.title}</title>
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="${site.title}" />
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      ${head}
    </head>
    <body>
      ${content}
      ${js}
    </body>
  </html>
`;
