# AGENTS.md

## Operational Charter: STOP → CONTRAST Grounding Invariant

1. **Primacy of the Outside Referent**: Pre-trained model weights suffer from temporal drift on React Native (e.g. legacy Reanimated v2/v3, severed Bridge APIs). Never guess APIs from memory—the Outside Referent (`rn-terrain`) is the only source of ground truth.
2. **Pre-Flight Grounding Gate**: Before modifying or creating any React Native `.tsx` / `.jsx` file, you MUST consult the Outside Referent via `tcdi_compass` or `preflight_grounding`.
3. **Mechanical State Receipt**: Calling `tcdi_compass` cuts an atomic timestamp receipt in `.agents/state/receipt.json`. Tool execution on React Native files without a fresh receipt is mechanically blocked by `.agents/gate.mjs`.
4. **Router Skill**: For any React Native or mobile development task, invoke the high-salience router skill at `.agents/skills/rn-entry/SKILL.md` before taking action.
5. **Zero Friction Outside Mobile**: Non-RN files (docs, configs, Rust, backend) bypass the gate with zero overhead.
