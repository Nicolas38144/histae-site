import Link from "next/link";
import type { Locale, SiteCopy } from "../lib/site-content";

export function SiteFooter({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-content">
        <div>
          <Link className="wordmark" href={`/${locale}`}>Histae<span aria-hidden="true">.</span></Link>
          <p>{copy.footer.line}</p>
        </div>
        <p className="footer-note">{copy.footer.madeFor}</p>
      </div>
    </footer>
  );
}
