import screenshotVersions from "../config/app-screenshots.json";
import { getMessagesForLocale } from "../messages";
import type { Locale } from "../lib/site-config";

export type ScreenKind = "feed" | "profile" | "chat" | "credits" | "privacy";

export function AppScreenshot({ locale, screen, priority = false }: {
  locale: Locale;
  screen: ScreenKind;
  priority?: boolean;
}) {
  const copy = getMessagesForLocale(locale).home.screens;
  const version = screenshotVersions[locale][screen];
  const base = `/images/app/${locale}/${screen}`;
  const original = `${base}.webp?v=${version.original}`;
  const small = `${base}-320.webp?v=${version.small}`;
  return (
    <figure className={`app-screenshot app-screenshot-${screen}`}>
      <div className="phone-frame">
        {/* Static export: ship already resized and compressed local assets. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={original} srcSet={`${small} 320w, ${original} 780w`}
          sizes="(max-width: 362px) calc(100vw - 50px), 312px" width={780} height={1688}
          alt={copy[screen]} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
      </div>
      <figcaption>{copy.caption}</figcaption>
    </figure>
  );
}
