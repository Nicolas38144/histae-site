export const locales = ["fr", "en", "es", "it"] as const;

export type Locale = (typeof locales)[number];
