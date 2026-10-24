import type { Locale } from '../site-config';
import { subscriptionHref } from './navigation';

export const subscriptionChannels = ['stripe', 'google', 'apple'] as const;
export type SubscriptionChannel = typeof subscriptionChannels[number];

export function subscriptionManagementHref(channel: SubscriptionChannel, locale: Locale): string {
  switch (channel) {
    case 'stripe': return subscriptionHref(locale);
    case 'google': return 'https://play.google.com/store/account/subscriptions';
    case 'apple': return 'https://apps.apple.com/account/subscriptions';
  }
}
