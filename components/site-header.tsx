"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  localeConfig,
  locales,
  localizedHref,
  navigationRouteIds,
  switchPathLocale,
  type Locale,
  type SiteRouteId,
} from "../lib/site-config";

export type SiteHeaderCopy = {
  common: {
    close: string;
    language: string;
    menu: string;
    navigation: string;
  };
  nav: Record<SiteRouteId, string>;
};

export function SiteHeader({ copy, locale }: { copy: SiteHeaderCopy; locale: Locale }) {
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

  const normalizedPath = pathname.replace(/\/$/, "") || `/${locale}`;
  const navigation = navigationRouteIds.map((routeId) => ({
    routeId,
    href: localizedHref(locale, routeId),
    label: copy.nav[routeId],
  }));

  return (
    <header className="site-header">
      <div className="shell header-content">
        <Link className="wordmark" href={localizedHref(locale, "home")} onClick={() => setIsMenuOpen(false)} aria-label="Histae">
          Histae<span aria-hidden="true">.</span>
        </Link>

        <button
          className="menu-trigger"
          type="button"
          aria-controls="site-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="menu-trigger-label">{copy.common.menu}</span>
          <span className="menu-lines" aria-hidden="true"><i /><i /></span>
        </button>

        <nav id="site-navigation" className="site-navigation" data-open={isMenuOpen} aria-label={copy.common.navigation}>
          {navigation.map((item) => (
            <Link
              key={item.routeId}
              href={item.href}
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
            <span>{copy.common.language}</span>
          </button>
          <Link className="header-cta" href={localizedHref(locale, "download")}>
            {copy.nav.download}
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
              <h2 id="language-dialog-title">{copy.common.language}</h2>
            </div>
            <button className="dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label={copy.common.close}>×</button>
          </div>
          <div className="language-list">
            {locales.map((targetLocale) => (
              <Link
                key={targetLocale}
                href={switchPathLocale(normalizedPath, targetLocale)}
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
