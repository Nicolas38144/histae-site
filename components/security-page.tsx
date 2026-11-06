import Link from "next/link";
import { childSafetyHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { AppStory, StoryPassage } from "./app-story";
import { InformationPage } from "./information-page";

export function SecurityPage({ locale }: { locale: Locale }) {
  const messages = getMessagesForLocale(locale);
  const page = messages.pages.security;
  const blocks = page.blocks;
  return (
    <InformationPage locale={locale} page={page} withSourceCode>
      <section className="shell editorial-statement">
        <h2>{blocks.promise.title}</h2><p>{blocks.promise.text}</p>
      </section>
      <AppStory locale={locale} screen="privacy" id="privacy" anchorId="privacy" main={blocks.consents}
        supporting={{ consentWithdrawal: blocks.consentWithdrawal }} reverse />
      <section className="shell editorial-pair">
        <StoryPassage block={blocks.passwordless} />
        <StoryPassage block={blocks.rights} />
      </section>
      <section className="shell credits-invitation" aria-labelledby="child-safety-title">
        <h2 id="child-safety-title">{messages.childSafety.title}</h2>
        <p>{messages.childSafety.intro}</p>
        <Link className="text-link" href={childSafetyHref(locale)}>{messages.childSafety.footer} →</Link>
      </section>
    </InformationPage>
  );
}
