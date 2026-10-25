import type { AppMessages } from '../messages';
import type { SiteRouteId } from './site-config';

type FaqCategory = keyof AppMessages['discovery']['categories'];
export type FaqEntry = {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  question: string;
  answer: string;
  href: string;
  linkLabel: string;
};

export const faqTopics = [
  { id: 'availability', category: 'start', route: 'download' },
  { id: 'account', category: 'start', route: 'safety' },
  { id: 'discovery', category: 'meeting', route: 'feature' },
  { id: 'match', category: 'meeting', route: 'feature' },
  { id: 'photos', category: 'meeting', route: 'feature' },
  { id: 'pricing', category: 'billing', route: 'pricing' },
  { id: 'sourceCode', category: 'privacy', route: 'safety' },
  { id: 'location', category: 'privacy', route: 'safety' },
  { id: 'moderation', category: 'privacy', route: 'safety' },
  { id: 'privacy', category: 'privacy', route: 'safety' },
] as const satisfies readonly {
  id: keyof AppMessages['faq']['items'];
  category: FaqEntry['category'];
  route: SiteRouteId;
}[];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

export function filterFaq(entries: readonly FaqEntry[], search: string, category: string) {
  const words = normalize(search).trim().split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    if (category !== 'all' && entry.category !== category) return false;
    const content = normalize(`${entry.question} ${entry.answer}`);
    return words.every(word => content.includes(word));
  });
}
