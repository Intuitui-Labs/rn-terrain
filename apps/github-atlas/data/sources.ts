import type { SourceDefinition } from '@openeval/core';

export const sources: SourceDefinition[] = [
  { id: 'github-pack', url: 'https://education.github.com/pack', kind: 'official_catalogue', authoritative: true },
  { id: 'github-student-experiences', url: 'https://github.com/education/students', kind: 'official_catalogue', authoritative: true },
  { id: 'github-partner-faq', url: 'https://github.com/github-education-resources/Student-Developer-Pack-Current-Partners-FAQ', kind: 'official_catalogue', authoritative: true },
  { id: 'digitalocean-pack', url: 'https://www.digitalocean.com/github-students', kind: 'provider_page', offerId: 'digitalocean', authoritative: true },
  { id: 'digitalocean-support-reports', url: 'https://www.digitalocean.com/community/questions/does-the-github-students-pack-removed-from-digitalocean', kind: 'community', offerId: 'digitalocean', authoritative: false },
];
