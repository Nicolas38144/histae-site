"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { AppMessages } from '../messages';
import { filterFaq, type FaqEntry } from '../lib/faq';

type Copy = Pick<AppMessages['discovery'],
  'search' | 'category' | 'categories' | 'results' | 'clear' | 'empty'>;

export function FaqExplorer({ entries, copy }: { entries: FaqEntry[]; copy: Copy }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const results = filterFaq(entries, search, category);
  const clear = () => { setSearch(''); setCategory('all'); };

  return (
    <div className="faq-explorer">
      <div className="faq-filters">
        <label>
          {copy.search}
          <input type="search" value={search} onChange={event => setSearch(event.target.value)} />
        </label>
        <label>
          {copy.category}
          <select aria-label={copy.category} value={category} onChange={event => setCategory(event.target.value)}>
            {Object.entries(copy.categories).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="demo-notice">{copy.results.replace('{count}', String(results.length))}</p>
      {(search || category !== 'all') && <button type="button" className="text-link" onClick={clear}>{copy.clear}</button>}
      <div className="faq-list">
        {results.map(entry => <FaqAnswer key={entry.id} entry={entry} />)}
      </div>
      {!results.length && <p>{copy.empty}</p>}
    </div>
  );
}

function FaqAnswer({ entry }: { entry: FaqEntry }) {
  return (
    <details className="faq-item">
      <summary><span>{entry.question}</span><span className="faq-toggle" aria-hidden="true">+</span></summary>
      <div className="faq-answer">
        <p>{entry.answer}</p>
        <Link className="text-link" href={entry.href}>{entry.linkLabel}<span aria-hidden="true"> →</span></Link>
      </div>
    </details>
  );
}
