import { $, $$, metaContent } from "./dom.js";

export async function init() {
  const currentProfileId = metaContent("current-profile-id");

  try {
    setVerificationStatus("loading");

    // Try to fetch the user's Actor object
    const resp = await fetch(currentProfileId, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!resp.ok) {
      return setVerificationStatus("unknown");
    }

    // Look for a link to this page as one of the Actor's attachments
    const data = await resp.json();
    if (data && data.attachment && Array.isArray(data.attachment)) {
      for (const item of data.attachment) {
        if (item.type === "PropertyValue") {
          const value = "" + item.value;
          if (value.indexOf(window.location.href) !== -1) {
            return setVerificationStatus("verified");
          }
        }
      }
    }

    return setVerificationStatus("unverified");  
  } catch (e) {
    setVerificationStatus("error");
  }
}

export function setVerificationStatus(status) {
  $$("section.verification").forEach(
    (el) => (el.className = `verification inset ${status}`)
  );
}

export async function domready() {}
