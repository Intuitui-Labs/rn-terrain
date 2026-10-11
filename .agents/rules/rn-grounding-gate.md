# Rule: React Native Grounding Invariant (STOP → CONTRAST)

Before writing, generating, or modifying any React Native or Expo source files (`.tsx`, `.jsx`, `.ts` touching native modules):

1. **Mandatory Outside Referent**:
   You must NEVER rely on frozen model weights or guess APIs from memory. You MUST invoke `tcdi_compass` (or the `rn-entry` router skill) to obtain verified ground-truth APIs.

2. **Mechanical State Receipt**:
   Calling `tcdi_compass` records an atomic timestamp in `.agents/state/receipt.json`. File edits without an active receipt will be intercepted and blocked by `.agents/gate.mjs`.

3. **Modern Standards Enforced**:
   - Reanimated v4 requires co-installing `react-native-worklets@^0.13.0`.
   - Banned: `useAnimatedGestureHandler` -> Mandatory: `<GestureDetector gesture={Gesture.Pan()}>`.
   - MMKV v4 requires synchronous Nitro instance methods.
