'use client';
import { useSearchParams } from 'next/navigation';
import { evaluateOffers, decodeShareState, type UserProfile } from '@intuitui-labs/openeval';
import { offers } from '../../data/offers';
import Link from 'next/link';

export default function ResultsContent() {
  const params = useSearchParams();
  const fallback: UserProfile = { goals: ['web_app'], weights: { capability: 4, simplicity: 3, learning: 2, launch: 3 } };
  const profile = decodeShareState(params.get('state') ?? '') ?? fallback;
  const result = evaluateOffers(offers, profile);
  const top = result.recommendations.filter((x) => x.tier === 'start_here');
  return <main className="work"><nav><Link href="/" className="mark">← ATLAS</Link><Link href="/start">Edit path</Link></nav><div className="results"><p className="eyebrow">YOUR TERRAIN / {profile.goals.join(' + ').toUpperCase().replaceAll('_', ' ')}</p><h1>Start here.</h1><p className="lede">A focused route for your priorities, with the trade-offs kept in view.</p><div className="result-list">{top.map((r, i) => <article className="result" key={r.offer.id}><div className="index">0{i + 1}</div><div><h2>{r.offer.name}</h2><p>{r.offer.description}</p><ul>{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul>{r.warnings.length > 0 && <div className="warnings">{r.warnings.map((x) => <p key={x}>⚠ {x}</p>)}</div>}</div><strong className="score">{r.score}<small>/100</small></strong></article>)}</div><h3>Useful next</h3><div className="next">{result.recommendations.filter((x) => x.tier === 'useful_next').map((r) => <span key={r.offer.id}>{r.offer.name}</span>)}</div><Link className="textlink" href="/method">Read the method behind this route →</Link></div></main>;
}


