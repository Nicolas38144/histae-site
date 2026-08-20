import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type Locale, type SiteRouteId } from "../lib/site-config";

const footerGroups: Array<{ titleKey: "exploreTitle" | "projectTitle"; routes: SiteRouteId[] }> = [
  { titleKey: "exploreTitle", routes: ["home", "feature", "pricing", "safety"] },
  { titleKey: "projectTitle", routes: ["about", "faq", "download"] },
];

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const navigationLabels: Record<SiteRouteId, string> = {
    home: t("nav.home"),
    feature: t("nav.feature"),
    pricing: t("nav.pricing"),
    safety: t("nav.safety"),
    about: t("nav.about"),
    faq: t("nav.faq"),
    download: t("nav.download"),
  };

  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Link className="wordmark" href={localizedHref(locale, "home")}>Histae<span aria-hidden="true">.</span></Link>
          <p className="footer-tagline">{t("footer.line")}</p>
          <p className="footer-summary">{t("footer.summary")}</p>
        </div>

        <nav className="footer-navigation" aria-label={t("footer.navigation")}>
          {footerGroups.map((group) => (
            <div className="footer-column" key={group.titleKey}>
              <h2>{t(`footer.${group.titleKey}`)}</h2>
              <ul>
                {group.routes.map((routeId) => (
                  <li key={routeId}>
                    <Link href={localizedHref(locale, routeId)}>{navigationLabels[routeId]}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer-status">
          <p className="footer-status-label">{t("footer.statusLabel")}</p>
          <p className="footer-status-value"><span aria-hidden="true" />{t("footer.status")}</p>
          <p>{t("footer.availability")}</p>
        </div>
      </div>

      <div className="shell footer-bottom">
        <p>© {new Date().getFullYear()} Histae. {t("footer.rights")}</p>
        <p>{t("footer.madeFor")}</p>
      </div>
    </footer>
  );
}
