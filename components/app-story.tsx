import { getMessagesForLocale } from "../messages";
import type { Locale } from "../lib/site-config";
import { AppScreenshot, type ScreenKind } from "./app-screenshot";

type StoryBlock = { title: string; text: string };
type StoryBlocks = Readonly<Record<string, StoryBlock>>;

export function StoryPassage({ block }: { block: StoryBlock }) {
  return <div className="story-passage"><h3>{block.title}</h3><p>{block.text}</p></div>;
}

export function StoryDetails({ blocks }: { blocks: StoryBlocks }) {
  const entries = Object.entries(blocks);
  if (!entries.length) return null;
  return (
    <div className="story-details">
      {entries.map(([id, block]) => (
        <details key={id}>
          <summary>{block.title}<span aria-hidden="true">+</span></summary>
          <p>{block.text}</p>
        </details>
      ))}
    </div>
  );
}

export function AppStory({ locale, screen, id, main, supporting = {}, more = {}, reverse = false, anchorId }: {
  locale: Locale;
  screen: ScreenKind;
  id: string;
  main: StoryBlock;
  supporting?: StoryBlocks;
  more?: StoryBlocks;
  reverse?: boolean;
  anchorId?: string;
}) {
  const screens = getMessagesForLocale(locale).home.screens;
  return (
    <section id={anchorId} className={`shell app-story${reverse ? " app-story-reverse" : ""}`} aria-labelledby={`story-${id}`}>
      <div className="story-copy">
        <p className="eyebrow">{screens[`${screen}Label`]}</p>
        <h2 id={`story-${id}`}>{main.title}</h2>
        <p className="story-lead">{main.text}</p>
        {Object.entries(supporting).map(([key, block]) => <StoryPassage key={key} block={block} />)}
        <StoryDetails blocks={more} />
      </div>
      <AppScreenshot locale={locale} screen={screen} />
    </section>
  );
}
