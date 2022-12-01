import { html, unescaped } from "../lib/html.js";
import { webfingerAddressWithBreak } from "../lib/utils.js";
import layoutPage from "./layoutPage.js";
import partialHeader from "./partialHeader.js";

export default (context) => {
  const { page = {}, partials = {}, profiles = [] } = context;
  return layoutPage(
    { ...context, page: { ...page, title: "Home" } },
    html`
      <article class="intro inset">
        ${unescaped(partials.siteDescription)}
      </article>
      <section class="members inset">
        <ul class="profiles">
          ${profiles.filter((profile) => !!profile.name).map(htmlProfileCard)}
        </ul>
      </section>
    `
  );
};

const htmlProfileCard = (profile) => {
  const { localProfileUrl, webfingerAddress, rssFeedUrl, name, icon } = profile;

  const iconUrl = icon
    ? icon.url
    : "https://mastodon.social/avatars/original/missing.png";

  const address = webfingerAddressWithBreak(webfingerAddress);

  return html`
    <li class="profile inset2">
      <a class="icon" href="${localProfileUrl}"><img src="${iconUrl}" /></a>
      <div class="meta">
        <span class="name">
          <a href="${localProfileUrl}">${name}</a>
          <a class="rss" href="${rssFeedUrl}"><span>RSS Feed</span></a>
        </span>
        <span class="address">${address}</span>
      </div>
    </li>
  `;
};
