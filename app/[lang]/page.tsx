import { HomePage } from "../../components/home-page";
import { createLocalizedPage } from "../../lib/localized-page";

export default createLocalizedPage((locale) => <HomePage locale={locale} />);
