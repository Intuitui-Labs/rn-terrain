import { Suspense } from 'react';
import ResultsContent from './results-content';

export default function Results() {
  return <Suspense fallback={<main className="work"><p>Loading your terrain…</p></main>}><ResultsContent /></Suspense>;
}


