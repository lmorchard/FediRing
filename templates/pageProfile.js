import { html, unescaped } from "../lib/html.js";
import { webfingerAddressWithBreak } from "../lib/utils.js";
import layoutPage from "./layoutPage.js";

export default ({ site = {}, page = {}, profile = {} }) => {
  const {
    id,
    webfingerAddress,
    url,
    name,
    preferredUsername,
    icon,
    image,
    summary,
    attachment,
    published,
  } = profile;

  const iconUrl = icon
    ? icon.url
    : "https://mastodon.social/avatars/original/missing.png";

  const imageUrl = image && image.url;

  const address = webfingerAddressWithBreak(webfingerAddress);

  // TODO: should probably sanitize this HTML?
  const summaryHtml = unescaped(summary);

  return layoutPage(
    {
      site,
      page: {
        ...page,
        className: "profile",
        title: `${name} - ${webfingerAddress}`,
      },
      head: html`
        <meta property="current-profile" content="${webfingerAddress}" />
        <meta property="current-profile-id" content="${id}" />
      `,
    },
    html`
      <header>
        <h1><a href="${site.url}/">${site.title}</a></h1>
      </header>
      <section class="intro inset">
        <p>${site.description}</p>
      </section>
      <section class="verification inset unknown">
        <p class="loading">🔃 Attempting to check verification status for this profile. 🔃</p>
        <p class="error">😞 Error encountered while checking verification status for this profile. 😞</p>
        <p class="unknown">⚠️ Verification status for this profile is unknown. ⚠️</p>
        <p class="verified">✅ This profile has consented to verification with this page. ✅</p>
        <p class="unverified">❗ This profile has not consented to verification with this page. ❗</p>
      </section>
      <section class="profile inset">
        <a class="icon" rel="me" href="${url}"><img src="${iconUrl}" /></a>
        <div class="meta">
          <a class="name" rel="me" href="${url}">${name}</a>
          <span class="address">${address}</span>
          <div class="summary">${summaryHtml}</div>
        </div>
      </section>
      ${navButtons("controls-bottom")}
    `
  );
};

const navButtons = (className) => html`
  <nav class="${className} controls inset">
    <button class="profile-previous">⬅️ Previous</button>
    <button class="profile-random">😎 Random</button>
    <button class="profile-next">Next ➡️</button>
  </nav>
`;
