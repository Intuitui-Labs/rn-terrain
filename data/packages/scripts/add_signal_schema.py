import sqlite3
c=sqlite3.connect('/workspace/rn-packages/rn_packages.db')
c.executescript("""
CREATE TABLE IF NOT EXISTS signal (
  id TEXT PRIMARY KEY,              -- uuid5(ns, source_kind+'|'+source_ref) for idempotent re-ingest
  source_kind TEXT NOT NULL,        -- x_post | screenshot | discourse | changelog | release | issue | pr | blog | newsletter | chat | doc | manual
  source_ref TEXT NOT NULL,         -- permalink, file path, or doc#anchor
  raw_path TEXT,                    -- local copy (screenshot/corpus path) for lossless retrieval
  author TEXT,                      -- handle as written
  published_at TEXT,                -- when the source said it (ISO, with offset)
  observed_at TEXT,                 -- when Naveen/agent saw it
  ingested_at TEXT NOT NULL,
  ingested_by TEXT,                 -- agent name
  title TEXT,
  excerpt TEXT,                     -- verbatim quote
  claim TEXT,                       -- normalized one-sentence claim
  state TEXT NOT NULL DEFAULT 'raw',-- raw | triaged | confirmed | rejected | superseded
  confidence REAL,                  -- 0..1 before confirmation
  confirmed_by TEXT, confirmed_at TEXT, confirm_evidence_url TEXT,
  supersedes_id TEXT REFERENCES signal(id)
);
CREATE TABLE IF NOT EXISTS combo (
  id TEXT PRIMARY KEY,              -- uuid5(ns, sorted member keys)
  label TEXT,                       -- e.g. 'Reanimated 4.7 + Worklets 0.13 + RN 0.88 rc'
  members TEXT NOT NULL             -- JSON [{package_id, npm_name, range}]
);
CREATE TABLE IF NOT EXISTS signal_link (
  signal_id TEXT NOT NULL REFERENCES signal(id) ON DELETE CASCADE,
  target_kind TEXT NOT NULL,        -- package | capability | pattern | version_band | combo | change | file | person | org | watch | idea
  target_id TEXT NOT NULL,          -- package.id / capability.id / pattern.id / combo.id / package_change key / repo path / handle / free key
  target_extra TEXT,                -- JSON, e.g. {"range":">=4.7.0 <4.8"} for version_band, {"line":42} for file
  relation TEXT NOT NULL,           -- mentions | announces | deprecates | breaks | fixes | recommends | warns | benchmarks | contradicts | confirms
  weight REAL,
  linked_by TEXT, linked_at TEXT, note TEXT,
  PRIMARY KEY (signal_id, target_kind, target_id, relation)
);
CREATE TABLE IF NOT EXISTS signal_promotion (
  signal_id TEXT NOT NULL REFERENCES signal(id),
  target_table TEXT NOT NULL,       -- package_change | capability | pattern | ...
  target_row_id TEXT NOT NULL,
  promoted_at TEXT NOT NULL, promoted_by TEXT,   -- only after confirm gate (state='confirmed')
  PRIMARY KEY (signal_id, target_table, target_row_id)
);
CREATE INDEX IF NOT EXISTS ix_signal_link_target ON signal_link(target_kind, target_id);
CREATE INDEX IF NOT EXISTS ix_signal_state ON signal(state, published_at);
CREATE VIEW IF NOT EXISTS v_signals_by_package AS
  SELECT p.name AS npm_name, s.state, s.published_at, s.source_kind, s.claim, s.source_ref, l.relation, l.target_kind, l.target_id
  FROM signal_link l JOIN signal s ON s.id=l.signal_id
  LEFT JOIN capability cap ON l.target_kind='capability' AND cap.id=l.target_id
  LEFT JOIN pattern pt ON l.target_kind='pattern' AND pt.id=l.target_id
  JOIN package p ON p.id = CASE l.target_kind WHEN 'package' THEN l.target_id WHEN 'version_band' THEN l.target_id
                                              WHEN 'capability' THEN cap.package_id WHEN 'pattern' THEN pt.package_id END;
""")
c.commit()
print([r[0] for r in c.execute("select name from sqlite_master where name like 'signal%' or name in ('combo','v_signals_by_package')")])
