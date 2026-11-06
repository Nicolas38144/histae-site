import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCommercialValues } from "../lib/plans";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { AppStory, StoryDetails, StoryPassage } from "./app-story";
import { InformationPage } from "./information-page";
import { ProductDemo } from "./product-demo";
import { ProfileWritingGuide } from "./profile-writing-guide";

export async function FeaturePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const page = messages.pages.feature;
  const blocks = page.blocks;
  const credits = {
    ...blocks.continuationCredits,
    text: t("pages.feature.blocks.continuationCredits.text", getCommercialValues()),
  };
  return (
    <InformationPage locale={locale} page={page}>
      <ProductDemo copy={messages.discovery} />
      <ProfileWritingGuide copy={messages.discovery} />
      <AppStory locale={locale} screen="feed" id="profile" main={blocks.profile}
        supporting={{ reading: blocks.reading, preferences: blocks.preferences }}
        more={{ discovery: blocks.discovery, location: blocks.location, stableDecisions: blocks.stableDecisions, pause: blocks.pause }} />
      <AppStory locale={locale} screen="chat" id="conversationWindow" main={blocks.conversationWindow}
        supporting={{ reciprocity: blocks.reciprocity, photoReveal: blocks.photoReveal }}
        more={{ continuationWindow: blocks.continuationWindow, messaging: blocks.messaging, notifications: blocks.notifications }} reverse />
      <section className="shell editorial-pair">
        <StoryPassage block={blocks.dailyUse} />
        <StoryPassage block={blocks.drafts} />
      </section>
      <section className="shell credits-invitation">
        <p className="eyebrow">{messages.home.screens.creditsLabel}</p>
        <h2>{credits.title}</h2>
        <p>{messages.pricing.credits.intro}</p>
        <StoryDetails blocks={{ continuationCredits: credits }} />
        <Link className="text-link" href={localizedHref(locale, "pricing")}>
          {messages.pricing.cta}<span aria-hidden="true"> →</span>
        </Link>
      </section>
    </InformationPage>
  );
}
