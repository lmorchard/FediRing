import { html, unescaped } from "../lib/html.js";
import layoutPage from "./layoutPage.js";
import moment from "moment";

export default ({ site = {}, page = {}, profiles = [] }) =>
  layoutPage(
    {
      site,
      page,
      head: html`
        <style>
          ul.profiles {
            list-style: none;
            margin: 0;
            padding: 0;
            text-indent: none;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: stretch;
            align-content: stretch;
          }
          ul.profiles li {
            border: 1px solid #ccc;
            padding: 4px;
            flex-grow: 1;
            flex-basis: 15%;
          }
          ul.profiles li img {
            display: block;
            width: 128px;
          }
        </style>
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
