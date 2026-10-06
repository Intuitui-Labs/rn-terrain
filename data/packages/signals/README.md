# Signal ingest (added 2026-10-06)

Any dated signal (X post, screenshot, discourse, changelog, issue, blog, chat, doc) is stored as data first, and hung on the graph wherever it's relevant. It is never treated as truth until confirmed.

Tables in `rn_packages.db`: `signal`, `signal_link`, `combo`, `signal_promotion`, view `v_signals_by_package`. The DDL is in `scripts/add_signal_schema.py`.

## Inbox contract (any agent can write)
Drop JSONL into `signals/inbox/<agent>-<YYYYMMDD-HHMM>.jsonl`, one signal per line:
```json
{"source_kind":"x_post","source_ref":"https://x.com/…/status/…","raw_path":null,"author":"@handle",
 "published_at":"2026-10-04T18:20:00+05:30","observed_at":"…","ingested_by":"X Feed Sense",
 "title":"…","excerpt":"verbatim","claim":"one-sentence normalized claim","confidence":0.6,
 "links":[
   {"target_kind":"package","npm_name":"react-native-reanimated","relation":"announces"},
   {"target_kind":"version_band","npm_name":"react-native-reanimated","range":">=4.8.0-0","relation":"announces"},
   {"target_kind":"capability","npm_name":"react-native-reanimated","capability_path":"Layout animations > LinearTransition","relation":"deprecates"},
   {"target_kind":"combo","members":[{"npm_name":"react-native-reanimated","range":"4.7.x"},{"npm_name":"react-native-worklets","range":"0.13.x"}],"relation":"warns"},
   {"target_kind":"watch","key":"new-arch/shared-element","relation":"mentions"}
 ]}
```
The loader resolves join keys: npm_name becomes package.id (uuid5 under ns `6f1c2a7e-5b0d-4c1e-9a3f-1e2d3c4b5a69`), capability_path becomes capability.id, and members become combo.id (uuid5 of sorted `name@range`). A signal's id is uuid5(source_kind|source_ref), so re-ingesting is idempotent.

## Gate
`state`: raw → triaged → confirmed / rejected / superseded. Only a `confirmed` signal (with `confirm_evidence_url`) can be promoted into `package_change` / `capability` / `pattern`, and each promotion is recorded in `signal_promotion`. Links are allowed at any state, which keeps everything traversable without making it canonical.
