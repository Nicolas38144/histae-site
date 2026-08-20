"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "../i18n/navigation";
import {
  localeConfig,
  locales,
  navigationRouteIds,
  routePath,
  type Locale,
  type SiteRouteId,
} from "../lib/site-config";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isLanguageOpen && !dialog.open) dialog.showModal();
    if (!isLanguageOpen && dialog.open) dialog.close();
  }, [isLanguageOpen]);

  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const navLabels: Record<SiteRouteId, string> = {
    home: t("nav.home"),
    feature: t("nav.feature"),
    pricing: t("nav.pricing"),
    safety: t("nav.safety"),
    about: t("nav.about"),
    download: t("nav.download"),
  };
  const navigation = navigationRouteIds.map((routeId) => ({
    routeId,
    href: routePath(routeId),
    label: navLabels[routeId],
  }));

  return (
    <header className="site-header">
      <div className="shell header-content">
        <Link className="wordmark" href="/" locale={locale} onClick={() => setIsMenuOpen(false)} aria-label="Histae">
          Histae<span aria-hidden="true">.</span>
        </Link>

        <button
          className="menu-trigger"
          type="button"
          aria-controls="site-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="menu-trigger-label">{t("common.menu")}</span>
          <span className="menu-lines" aria-hidden="true"><i /><i /></span>
        </button>

        <nav id="site-navigation" className="site-navigation" data-open={isMenuOpen} aria-label={t("common.navigation")}>
          {navigation.map((item) => (
            <Link
              key={item.routeId}
              href={item.href}
              locale={locale}
              aria-current={normalizedPath === item.href ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="language-trigger" type="button" onClick={() => setIsLanguageOpen(true)} aria-haspopup="dialog">
            <span className="language-marker" aria-hidden="true">{locale.toUpperCase()}</span>
            <span>{t("common.language")}</span>
          </button>
          <Link className="header-cta" href={routePath("download")} locale={locale}>
            {t("nav.download")}
          </Link>
        </div>
      </div>

      <dialog ref={dialogRef} className="language-dialog" aria-labelledby="language-dialog-title" onClose={() => setIsLanguageOpen(false)} onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}>
        <div className="language-dialog-content">
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">Histae</p>
              <h2 id="language-dialog-title">{t("common.language")}</h2>
            </div>
            <button className="dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label={t("common.close")}>×</button>
          </div>
          <div className="language-list">
            {locales.map((targetLocale) => (
              <Link
                key={targetLocale}
                href={normalizedPath}
                locale={targetLocale}
                lang={targetLocale}
                aria-current={targetLocale === locale ? "true" : undefined}
                onClick={() => dialogRef.current?.close()}
              >
                <span>{localeConfig[targetLocale].label}</span>
                <span aria-hidden="true">{targetLocale.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </dialog>
    </header>
  );
}
