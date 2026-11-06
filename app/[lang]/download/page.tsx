import { DownloadPage } from "../../../components/download-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("download");

export default createLocalizedPage((locale) => <DownloadPage locale={locale} />);
