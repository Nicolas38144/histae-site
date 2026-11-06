import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { createLocalizedPage, createPageMetadata, type LocalizedPageProps } from "../../../lib/localized-page";
import { localizedHref } from "../../../lib/site-config";

// Caddy performs the HTTP 308 in production; this also handles development
// and preserves a redirect document in the static export.
const aboutMetadata = createPageMetadata("about");
export async function generateMetadata(props: LocalizedPageProps): Promise<Metadata> {
  return { ...await aboutMetadata(props), robots: { index: false, follow: true } };
}
export default createLocalizedPage((locale) => permanentRedirect(`${localizedHref(locale, "about")}/`));
