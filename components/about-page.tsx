import type { Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { AppStory } from "./app-story";
import { InformationPage } from "./information-page";

export function AboutPage({ locale }: { locale: Locale }) {
  const page = getMessagesForLocale(locale).pages.about;
  const blocks = page.blocks;
  return (
    <InformationPage locale={locale} page={page} withSourceCode>
      <section className="shell editorial-statement">
        <h2>{blocks.promise.title}</h2><p>{blocks.promise.text}</p>
      </section>
      <AppStory locale={locale} screen="profile" id="product" main={blocks.product}
        supporting={{ community: blocks.community }} more={{ privacy: blocks.privacy }} reverse />
    </InformationPage>
  );
}
