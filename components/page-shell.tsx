import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "../lib/site-config";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function PageShell({ children, locale }: { children: ReactNode; locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <div className="site-frame" lang={locale}>
      <a className="skip-link" href="#main-content">{t("common.skip")}</a>
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
    </div>
  );
}
