import Link from "next/link";
import type { Locale, SiteCopy } from "../lib/site-content";

export function HomePage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  return (
    <main id="main-content">
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1 id="hero-title">{copy.home.title}</h1>
          <p className="hero-intro">{copy.home.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${locale}/download`}>{copy.home.primary}</Link>
            <Link className="text-link" href={`/${locale}/feature`}>{copy.home.secondary}<span aria-hidden="true"> →</span></Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-glow art-glow-left" />
          <span className="art-glow art-glow-right" />
          <span className="art-orbit art-orbit-one" />
          <span className="art-orbit art-orbit-two" />
          <span className="art-thread art-thread-left" />
          <span className="art-thread art-thread-right" />
          <span className="art-point" />
        </div>
      </section>

      <section className="shell section" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">Histae</p>
          <h2 id="principles-title">{copy.home.principlesTitle}</h2>
        </div>
        <div className="principles-grid">
          {copy.home.principles.map((principle, index) => (
            <article className="principle-card" key={principle.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rhythm-section">
        <div className="shell rhythm-layout">
          <div className="section-heading">
            <p className="eyebrow">{copy.home.rhythmEyebrow}</p>
            <h2>{copy.home.rhythmTitle}</h2>
            <p>{copy.home.rhythmIntro}</p>
          </div>
          <ol className="steps-list">
            {copy.home.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell safety-teaser" aria-labelledby="safety-title">
        <div>
          <p className="eyebrow">{copy.home.safetyEyebrow}</p>
          <h2 id="safety-title">{copy.home.safetyTitle}</h2>
        </div>
        <div>
          <p>{copy.home.safetyText}</p>
          <Link className="text-link" href={`/${locale}/security`}>{copy.home.safetyLink}<span aria-hidden="true"> →</span></Link>
        </div>
      </section>

      <section className="shell closing-section" aria-labelledby="closing-title">
        <p className="eyebrow">Histae</p>
        <h2 id="closing-title">{copy.home.closingTitle}</h2>
        <p>{copy.home.closingText}</p>
        <Link className="button button-primary" href={`/${locale}/download`}>{copy.home.primary}</Link>
      </section>
    </main>
  );
}
