import { $, $$, metaContent } from "./dom.js";

export async function init() {
  const currentProfileId = metaContent("current-profile-id");

  try {
    setVerificationStatus("loading");
    const resp = await fetch(currentProfileId, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await resp.json();
    console.log("PROFILE", data);
    setVerificationStatus("verified");
  } catch (e) {
    setVerificationStatus("unknown");
  }
}

export function setVerificationStatus(status) {
  $$("section.verification").forEach(
    (el) => (el.className = `verification inset ${status}`)
  );
}

export async function domready() {}
