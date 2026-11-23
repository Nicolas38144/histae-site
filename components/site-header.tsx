"use client";

import Link from "next/link";
import { BrandSignature } from "./brand-signature";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  localeConfig,
  locales,
  localizedHref,
  accountDataHref,
  navigationRouteIds,
  switchPathLocale,
  type Locale,
  type SiteRouteId,
} from "../lib/site-config";

const narrowNavigation = "(max-width: 1120px)";

function subscribeToNavigationWidth(onChange: () => void) {
  const query = window.matchMedia(narrowNavigation);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const isNarrowNavigation = () => window.matchMedia(narrowNavigation).matches;
const renderNarrowNavigation = () => true;

export type SiteHeaderCopy = {
  common: {
    close: string;
    language: string;
    menu: string;
    navigation: string;
  };
  nav: Record<SiteRouteId, string> & { account: string };
};

export function SiteHeader({ copy, locale }: { copy: SiteHeaderCopy; locale: Locale }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const isNarrow = useSyncExternalStore(subscribeToNavigationWidth, isNarrowNavigation, renderNarrowNavigation);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  function closeMenu() {
    const menu = menuRef.current;
    if (menu?.hidePopover && menu.matches(":popover-open")) menu.hidePopover();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isLanguageOpen && !dialog.open) dialog.showModal();
    if (!isLanguageOpen && dialog.open) dialog.close();
  }, [isLanguageOpen]);

  const normalizedPath = pathname.replace(/\/$/, "") || `/${locale}`;
  const navigation = [
    ...navigationRouteIds.map((routeId) => ({
      routeId,
      href: localizedHref(locale, routeId),
      label: copy.nav[routeId],
    })),
    {
      routeId: "account",
      href: accountDataHref(locale),
      label: copy.nav.account,
    },
  ];

  return (
    <header className="site-header">
      <div className="shell header-content">
        <Link className="wordmark" href={localizedHref(locale, "home")} aria-label="Histae">
          <BrandSignature />
        </Link>

        <nav id="site-navigation" className="site-navigation" aria-label={copy.common.navigation}>
          <button className="menu-trigger" type="button" popoverTarget="site-menu" aria-controls="site-menu" aria-label={copy.common.menu}>
            <span className="menu-trigger-label">{copy.common.menu}</span>
            <span className="menu-lines" aria-hidden="true"><i /><i /></span>
          </button>
          <ul className="site-menu" id="site-menu" ref={menuRef} popover={isNarrow ? "auto" : undefined}>
            {navigation.map((item) => (
              <li key={item.routeId}>
                <Link
                  href={item.href}
                  aria-current={normalizedPath === item.href.replace(/\/$/, "") ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="language-trigger" type="button" onClick={() => setIsLanguageOpen(true)} aria-label={copy.common.language} aria-haspopup="dialog" aria-controls="language-dialog" aria-expanded={isLanguageOpen}>
            <span className="language-marker" aria-hidden="true">{locale.toUpperCase()}</span>
            <span>{copy.common.language}</span>
          </button>
          <Link className="header-cta" href={localizedHref(locale, "download")}>
            {copy.nav.download}
          </Link>
        </div>
      </div>

      <dialog id="language-dialog" ref={dialogRef} className="language-dialog" aria-labelledby="language-dialog-title" onClose={() => setIsLanguageOpen(false)} onClick={(event) => {
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
