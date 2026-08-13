import type { ReactNode } from "react";
import { type Locale, type SiteCopy } from "../lib/site-content";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ children, locale, copy }: { children: ReactNode; locale: Locale; copy: SiteCopy }) {
  return (
    <div className="site-frame" lang={locale}>
      <a className="skip-link" href="#main-content">{copy.common.skip}</a>
      <SiteHeader locale={locale} copy={copy} />
      {children}
      <SiteFooter locale={locale} copy={copy} />
    </div>
  );
}
