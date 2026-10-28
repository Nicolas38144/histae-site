"use client";

import { useState } from 'react';
import type { AppMessages } from '../messages';
import { supportEmail, type Locale } from '../lib/site-config';
import { subscriptionChannels, subscriptionManagementHref, type SubscriptionChannel } from '../lib/billing/subscription-channels';

type Copy = Pick<AppMessages['discovery'], 'helpTitle' | 'helpIntro' | 'channels' | 'restore' | 'helpNote'>;

export function SubscriptionHelp({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [channel, setChannel] = useState<SubscriptionChannel>('stripe');
  const selected = copy.channels[channel];

  return (
    <section className="shell subscription-help" id="subscription-help" aria-labelledby="help-title">
      <h2 id="help-title">{copy.helpTitle}</h2>
      <p>{copy.helpIntro}</p>
      <div className="choice-row" role="group" aria-label={copy.helpTitle}>
        {subscriptionChannels.map(id => (
          <button key={id} type="button" aria-pressed={channel === id} aria-controls="provider-help" onClick={() => setChannel(id)}>
            {copy.channels[id].label}
          </button>
        ))}
      </div>
      <div id="provider-help" className="provider-help">
        <h3>{selected.label}</h3>
        <p>{selected.text}</p>
        <a className="button button-primary" href={subscriptionManagementHref(channel, locale)}>{selected.action}</a>
      </div>
      <p>{copy.restore}</p>
      <p className="demo-notice">{copy.helpNote}</p>
      <a className="text-link" href={`mailto:${supportEmail}`}>{supportEmail}</a>
    </section>
  );
}
