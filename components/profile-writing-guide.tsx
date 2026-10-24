import type { AppMessages } from '../messages';

type Copy = Pick<AppMessages['discovery'], 'guideTitle' | 'guideIntro' | 'tips' | 'guideEnd'>;

export function ProfileWritingGuide({ copy }: { copy: Copy }) {
  return (
    <section className="shell writing-guide" id="writing-guide" aria-labelledby="writing-title">
      <div className="section-heading">
        <h2 id="writing-title">{copy.guideTitle}</h2>
        <p>{copy.guideIntro}</p>
      </div>
      <div className="writing-passages">
        {copy.tips.map(tip => (
          <article key={tip.title}><h3>{tip.title}</h3><p>{tip.text}</p></article>
        ))}
      </div>
      <p className="writing-note">{copy.guideEnd}</p>
    </section>
  );
}
