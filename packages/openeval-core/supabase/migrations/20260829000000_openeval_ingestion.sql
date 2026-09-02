-- OpenEval+ ingestion storage.
-- Raw snapshots should be stored in Supabase Storage; these tables keep metadata,
-- extracted claims, review decisions, and the published read model.

create table if not exists ingestion_sources (
  id text primary key,
  url text not null,
  kind text not null,
  offer_id text,
  authoritative boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists source_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references ingestion_sources(id),
  fetched_at timestamptz not null,
  http_status integer not null,
  content_hash text not null,
  storage_key text,
  adapter text not null,
  unique (source_id, content_hash)
);

create table if not exists extracted_facts (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references source_snapshots(id),
  offer_id text,
  field text not null,
  value jsonb not null,
  confidence text not null,
  requires_review boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ingestion_change_events (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references ingestion_sources(id),
  snapshot_id uuid references source_snapshots(id),
  change_kind text not null,
  detected_at timestamptz not null,
  previous_hash text,
  current_hash text,
  review_status text not null default 'pending',
  error text
);

create table if not exists catalogue_releases (
  version text primary key,
  evaluator_version text not null,
  source_commit text,
  published_at timestamptz not null default now(),
  catalogue jsonb not null
);

create index if not exists source_snapshots_source_date on source_snapshots(source_id, fetched_at desc);
create index if not exists ingestion_events_review on ingestion_change_events(review_status, detected_at desc);
