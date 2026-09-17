# Publishing Guide for `@intuitui-labs/rn-terrain` Monorepo Packages

This guide details the release cycle, quality preflight checks, authentication, 2FA/OTP handling, and CI/CD automation 
for publishing **`@intuitui-labs/rn-terrain`** packages to the public npm registry.

---

## 1. Monorepo Distribution Matrix

| Package Name | Scope | Role | Subpath Exports |
| :--- | :--- | :--- | :--- |
| **`@intuitui-labs/rn-terrain-core`** | Public | Vitality engine & schema | `.`, `./db`, `./queries`, `./radar`, `./scoring`, `./sync-daily`, `./types` |
| **`@intuitui-labs/rn-terrain-cli`** | Public | Radar terminal CLI (`rn-terrain`, `rn-eval`) | `.`, `./package.json` |
| **`@intuitui-labs/rn-terrain-mcp`** | Public | Model Context Protocol server for AI coding agents | `.`, `./package.json` |
| **`@intuitui-labs/openeval`** | Public | Autonomous library evaluation engine | `.`, `./ingestion` |
| **`@intuitui-labs/rn-terrain-vscode`** | VSIX | Visual Studio Code extension | `./dist/extension.js` |

---

## 2. Prerequisites & Access

To publish packages under the `@intuitui-labs` organization scope:
1. **npm Organization**: You must be an Owner or Maintainer of the 
[`@intuitui-labs`](https://www.npmjs.com/org/intuitui-labs) organization on npm.
2. **Account 2FA**: npm mandates Two-Factor Authentication (2FA) for write and publish actions on all packages.
3. **npm Authentication**: Ensure your CLI is logged in:
   ```bash
   npm whoami
   # Verify your username
   ```

---

## 3. Preflight Quality Verification Gate

Never publish without passing all workspace verification gates:

```bash
# 1. Zero-error strict TypeScript check across all packages
pnpm run check-types

# 2. Vitest 5 Test Suite with v8 Coverage
pnpm run test:coverage

# 3. Clean production compilation
pnpm run build
```

---

## 4. Tree-Shakable & Subpath Export Verification

Every public package exposes granular entry points with `"sideEffects": false`:
- Consumers can import exact submodules without pulling heavy dependencies:
  ```typescript
  // Fast & tree-shakeable:
  import { calculateVitalityScore } from '@intuitui-labs/rn-terrain-core/scoring';
  import { evaluateOffers } from '@intuitui-labs/openeval';
  ```

---

## 5. Manual Publishing via CLI (Local)

Because scoped packages default to private on npm, pass `--access public`.

### Publishing a Specific Package
```bash
# Example: Publishing rn-terrain-core
cd packages/core
npm publish --access public
# When prompted, enter your 6-digit TOTP code
```

### Providing OTP via Flag
```bash
npm publish --access public --otp=123456
```

---

## 6. Automated CI/CD Publishing (GitHub Actions with Provenance)

When a GitHub Release is created, the workflow automatically publishes all changed packages with cryptographic build provenance:

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 12.4.2

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install --frozen-lockfile
      - run: pnpm run check-types
      - run: pnpm run test
      - run: pnpm run build

      - name: Publish @intuitui-labs packages
        run: pnpm -r --filter "./packages/*" publish --access public --provenance --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 7. Verifying Registry Propagation

```bash
npm view @intuitui-labs/rn-terrain-core version
npm view @intuitui-labs/rn-terrain-cli version
npm view @intuitui-labs/rn-terrain-mcp version
npm view @intuitui-labs/openeval version
```

