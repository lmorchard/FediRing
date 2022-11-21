import { $, $$, metaContent } from "./dom.js";

const profiles = {
  allProfiles: [],
};

export async function init() {
}

export async function domready() {
  const currentProfile = metaContent("current-profile");
  if (!currentProfile) return;
  profiles.currentProfile = currentProfile;

  $$("nav.controls").forEach(controls => controls.classList.add("loading"));

  const profilesIndexUrl = metaContent("profiles-index");
  const resp = await fetch(profilesIndexUrl);
  const data = await resp.json();
  if (!data) return;

  $$("nav.controls").forEach(controls => controls.classList.remove("loading"));
  
  profiles.allProfiles = data;

  $$("button.profile-previous").forEach((button) =>
    button.addEventListener("click", gotoProfilePrevious)
  );
  $$("button.profile-random").forEach((button) =>
    button.addEventListener("click", gotoProfileRandom)
  );
  $$("button.profile-next").forEach((button) =>
    button.addEventListener("click", gotoProfileNext)
  );
}

export const findProfileIndex = (addr) =>
  profiles.allProfiles.findIndex((profile) => profile.webfingerAddress == addr);

export const findCurrentProfileIndex = () =>
  findProfileIndex(profiles.currentProfile);

export async function gotoProfilePrevious() {
  let index = findCurrentProfileIndex() - 1;
  if (index < 0) {
    index = profiles.allProfiles.length - 1;
  }
  gotoProfileAtIndex(index);
}

export async function gotoProfileRandom() {
  let currIndex = findCurrentProfileIndex();
  let index;
  do {
    index = Math.floor(Math.random() * profiles.allProfiles.length);
  } while (index === currIndex);
  gotoProfileAtIndex(index);
}

export async function gotoProfileNext() {
  let index = findCurrentProfileIndex() + 1;
  if (index >= profiles.allProfiles.length) {
    index = 0;
  }
  gotoProfileAtIndex(index);
}

export async function gotoProfileAtIndex(index) {
  const profile = profiles.allProfiles[index];
  console.log("GO", index, profile);
  window.location.href = profile.localProfileUrl;
}
