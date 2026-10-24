import type { AppMessages } from '../../messages';

type Copy = AppMessages['discovery'];

export function DemoProfile({ copy }: { copy: Pick<Copy, 'name' | 'bio'> }) {
  return <article><p className="demo-name">{copy.name}</p>{copy.bio.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article>;
}

export function DemoConversation({ copy }: { copy: Pick<Copy, 'chatIntro' | 'chat'> }) {
  return <>
    <p>{copy.chatIntro}</p>
    <div className="demo-chat">
      {copy.chat.map((message, index) => <p key={message} className={index % 2 ? 'reply' : ''}>{message}</p>)}
    </div>
  </>;
}

type PhotoProps = {
  copy: Pick<Copy, 'photoIntro' | 'mine' | 'theirs' | 'revealed' | 'waiting' | 'portrait'>;
  mine: boolean;
  theirs: boolean;
  onMineChange: (value: boolean) => void;
  onTheirsChange: (value: boolean) => void;
};

export function DemoPhotos({ copy, mine, theirs, onMineChange, onTheirsChange }: PhotoProps) {
  const revealed = mine && theirs;
  return <>
    <p>{copy.photoIntro}</p>
    <div className="demo-consents">
      <label><input type="checkbox" checked={mine} onChange={event => onMineChange(event.target.checked)} />{copy.mine}</label>
      <label><input type="checkbox" checked={theirs} onChange={event => onTheirsChange(event.target.checked)} />{copy.theirs}</label>
    </div>
    <p role="status">{revealed ? copy.revealed : copy.waiting}</p>
    {revealed && <DemoPortrait label={copy.portrait} />}
  </>;
}

function DemoPortrait({ label }: { label: string }) {
  return (
    <figure className="demo-portrait">
      <svg viewBox="0 0 160 160" role="img" aria-label={label}>
        <rect width="160" height="160" rx="80" fill="#24243d" />
        <circle cx="80" cy="62" r="28" fill="#f2a48c" />
        <path d="M28 145c0-55 104-55 104 0" fill="#d8b3f7" />
        <path d="M51 60c-8-44 64-44 58 0-20-2-33-13-38-19-5 12-12 17-20 19" fill="#392243" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
