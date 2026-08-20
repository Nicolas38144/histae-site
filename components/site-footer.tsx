import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type Locale } from "../lib/site-config";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <footer className="site-footer">
      <div className="shell footer-content">
        <div>
          <Link className="wordmark" href={localizedHref(locale, "home")}>Histae<span aria-hidden="true">.</span></Link>
          <p>{t("footer.line")}</p>
        </div>
        <p className="footer-note">{t("footer.madeFor")}</p>
      </div>
    </footer>
  );
}
