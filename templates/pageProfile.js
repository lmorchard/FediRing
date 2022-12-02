import { html, unescaped } from "../lib/html.js";
import { webfingerAddressWithBreak } from "../lib/utils.js";
import layoutPage from "./layoutPage.js";

export default (context) => {
  const { site = {}, page = {}, partials = {}, profile = {} } = context;
  const {
    siteTitle
  } = partials;
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
    rssFeedUrl,
    localProfileUrl,
  } = profile;

  const iconUrl = icon
    ? icon.url
    : "https://mastodon.social/avatars/original/missing.png";

  const imageUrl = image && image.url;

  const address = webfingerAddressWithBreak(webfingerAddress);

  // TODO: should probably sanitize this HTML?
  const summaryHtml = unescaped(summary);

  // TODO: Generalize this variable substitution
  const howToVerify = partials.howToVerify
    .replace(/\$\{siteTitle\}/g, siteTitle)
    .replace(/\$\{localProfileUrl\}/g, localProfileUrl);

  return layoutPage(
    {
      ...context,
      page: {
        ...page,
        className: "page-profile",
        title: `${name} - ${webfingerAddress}`,
      },
      head: html`
        <meta property="current-profile" content="${webfingerAddress}" />
        <meta property="current-profile-id" content="${id}" />
      `,
    },
    html`
      ${navButtons("controls-top")}
      <section class="profile inset">
        <a class="icon" rel="me" href="${url}"><img src="${iconUrl}" /></a>
        <div class="meta">
          <span class="name">
            <a rel="me" href="${url}">${name}</a>
            <a class="rss" href="${rssFeedUrl}"><span>RSS Feed</span></a>
          </span>
          <span class="address">${address}</span>
          <div class="summary">${summaryHtml}</div>
        </div>
      </section>
      <section class="verification inset unknown">
        <p class="loading">🔃 Attempting to check verification. 🔃</p>
        <p class="error">
          😞 Error encountered while checking verification. 😞
        </p>
        <p class="unknown">⚠️ Verification status is unknown. ⚠️</p>
        <p class="verified">✅ Verification confirmed. ✅</p>
        <p class="unverified">❗ This profile is not verified. ❗</p>
      </section>

      <section class="inset">
        <details class="verification-instructions">
          <summary>This is my profile, how do I verify it?</summary>
          ${unescaped(howToVerify)}
        </details>
      </section>
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
