import { html, unescaped } from "../lib/html.js";
import layoutPage from "./layoutPage.js";
import moment from "moment";

export default ({ site = {}, page = {}, profiles = [] }) =>
  layoutPage(
    {
      site,
      page,
      head: html`
      `,
    },
    html`
      <h1>${site.title}</h1>
      <ul class="profiles">
        ${profiles
          .filter((profile) => !!profile.name)
          .map(
            (profile) => html`
              <li>
                ${profile.icon &&
                html`<a href="${profile.url}"
                  ><img src="${profile.icon.url}"
                /></a>`}
                <a href="${profile.url}">${profile.name}</a>
              </li>
            `
          )}
      </ul>
    `
  );
