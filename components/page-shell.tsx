import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "../lib/site-config";
import { SiteFooter } from "./site-footer";
import { SiteHeader, type SiteHeaderCopy } from "./site-header";

export async function PageShell({ children, locale }: { children: ReactNode; locale: Locale }) {
  const t = await getTranslations({ locale });
  const headerCopy: SiteHeaderCopy = {
    common: {
      close: t("common.close"),
      language: t("common.language"),
      menu: t("common.menu"),
      navigation: t("common.navigation"),
    },
    nav: {
      home: t("nav.home"),
      feature: t("nav.feature"),
      pricing: t("nav.pricing"),
      safety: t("nav.safety"),
      about: t("nav.about"),
      faq: t("nav.faq"),
      download: t("nav.download"),
    },
  };

  return (
    <div className="site-frame" lang={locale}>
      <a className="skip-link" href="#main-content">{t("common.skip")}</a>
      <SiteHeader copy={headerCopy} locale={locale} />
      {children}
      <SiteFooter locale={locale} />
    </div>
  );
}
