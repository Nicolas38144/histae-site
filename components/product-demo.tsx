"use client";

import type { AppMessages } from '../messages';
import { DemoProfile, DemoConversation, DemoPhotos } from './product-demo/demo-panels';
import { demoSteps, useProductDemo } from './product-demo/use-product-demo';

type Copy = Pick<AppMessages['discovery'],
  'title' | 'intro' | 'fiction' | 'steps' | 'name' | 'bio' | 'chatIntro' | 'chat' |
  'photoIntro' | 'mine' | 'theirs' | 'revealed' | 'waiting' | 'portrait' | 'next' | 'restart'>;

export function ProductDemo({ copy }: { copy: Copy }) {
  const journey = useProductDemo();
  return (
    <section className="shell product-demo" id="demo" aria-labelledby="demo-title">
      <div className="section-heading"><h2 id="demo-title">{copy.title}</h2><p>{copy.intro}</p></div>
      <p className="demo-notice">{copy.fiction}</p>
      <div className="choice-row" role="group" aria-label={copy.title}>
        {demoSteps.map((step, index) => (
          <button key={step} type="button" aria-pressed={journey.step === step} aria-controls="demo-panel" onClick={() => journey.setStep(step)}>
            {copy.steps[index]}
          </button>
        ))}
      </div>
      <div className="demo-panel" id="demo-panel">
        <h3>{copy.steps[demoSteps.indexOf(journey.step)]}</h3>
        {journey.step === 'profile' && <DemoProfile copy={copy} />}
        {journey.step === 'conversation' && <DemoConversation copy={copy} />}
        {journey.step === 'photos' && <DemoPhotos copy={copy} mine={journey.mine} theirs={journey.theirs} onMineChange={journey.setMine} onTheirsChange={journey.setTheirs} />}
      </div>
      <div className="demo-actions">
        <button className="button button-primary" type="button" onClick={journey.advance}>
          {journey.step === 'photos' ? copy.restart : copy.next}
        </button>
      </div>
    </section>
  );
}
