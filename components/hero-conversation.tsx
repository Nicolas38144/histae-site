import type { AppMessages } from "../messages";

export function HeroConversation({ copy }: { copy: AppMessages["home"]["conversation"] }) {
  return (
    <figure className="hero-conversation" aria-labelledby="conversation-caption">
      <svg className="conversation-thread" viewBox="0 0 480 560" fill="none" aria-hidden="true">
        <path d="M-30 95C120-20 470 45 398 226S16 352 105 480s322 37 417-48" />
      </svg>
      <p className="conversation-overline">{copy.eyebrow}</p>
      <div className="conversation-question">
        <span className="conversation-label">{copy.questionLabel}</span>
        <p>{copy.question}</p>
      </div>
      <blockquote className="conversation-message conversation-first">
        <p>{copy.answer}</p>
        <cite>{copy.firstName}</cite>
      </blockquote>
      <blockquote className="conversation-message conversation-reply">
        <p>{copy.reply}</p>
        <cite>{copy.secondName}</cite>
      </blockquote>
      <figcaption id="conversation-caption">{copy.caption}</figcaption>
    </figure>
  );
}
