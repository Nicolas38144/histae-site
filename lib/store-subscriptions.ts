export const subscriptionChannels = ["google", "apple"] as const;
export type SubscriptionChannel = typeof subscriptionChannels[number];

export function subscriptionManagementHref(channel: SubscriptionChannel): string {
  switch (channel) {
    case "google": return "https://play.google.com/store/account/subscriptions";
    case "apple": return "https://apps.apple.com/account/subscriptions";
  }
}
