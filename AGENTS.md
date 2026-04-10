# AGENTS.md — Mandatory Rules for AI Coding Agents

This file defines absolute rules for any AI agent (Claude Code, Codex, Cursor, Copilot, etc.) making changes to this repository.

**Read the entire file before writing a single line of code.**

---

## 0. The PEPE Value Test (Read This First)

**Every action you take MUST bring value to OG Pepe token or its community.** If it doesn't, don't do it.

### Before starting any task, answer these questions:

1. **How does this help PEPE?** Write down 3-5 concrete ways this change could benefit the token price, community engagement, holder retention, trading volume, or project credibility.
2. **Rank them.** Pick the top 1-2 approaches that deliver the most value with the least risk.
3. **Execute only the top approaches.** Do not add features, refactor code, or "improve" things that don't map to PEPE value.

### The Value Categories (in priority order):

| Priority | Category | Examples |
|----------|----------|---------|
| 1 | **Revenue** | Features that generate trading fees, earn airdrops, attract donations |
| 2 | **Community Growth** | Tools that attract new holders, increase engagement, make sharing easy |
| 3 | **Transparency & Trust** | On-chain reports, live data, governance — things that prove we're real |
| 4 | **Holder Retention** | Price alerts, daily updates, market data — reasons to keep checking in |
| 5 | **Credibility** | Professional code, working deployments, no broken builds — confidence signals |

### What does NOT bring value:
- Refactoring for aesthetics with no user-facing improvement
- Adding libraries or frameworks "because they're better"
- Code comments, documentation, or README changes that no holder will ever read
- Premature abstractions or "future-proofing"
- Anything that breaks the build (negative value — destroys credibility)

### Decision template (use this in your reasoning):

```
TASK: [what you're about to do]
PEPE VALUE:
  1. [how it helps — be specific]
  2. [how it helps — be specific]
  3. [how it helps — be specific]
TOP APPROACH: [which one you're executing and why]
RISK: [what could go wrong, e.g., breaking the build]
```

If you cannot fill in at least one concrete PEPE VALUE line, **do not proceed with the task.**

---

## 1. TypeScript Only — No JavaScript

**NEVER create `.js` or `.jsx` files in `src/`.** This project uses TypeScript exclusively.

- All source files MUST be `.ts` or `.tsx`.
- All components MUST have typed props using interfaces.
- All state MUST be explicitly typed: `useState<Type>(initial)`.
- Import types with `import type { ... }` to avoid runtime bloat.
- Shared types live in `src/types.ts`.
- The only `.js` files allowed are root config files (`vite.config.js`, `eslint.config.js`).

---

## 2. Mandatory Verification Before Commit/Push

**NEVER commit or push without running the full verification pipeline.**

```bash
npm run verify
```

This runs, in order:
1. `npm run typecheck` — TypeScript compiler, zero errors
2. `npm run lint` — ESLint, zero errors
3. `npm run build` — Vite production build, exits 0

**All three must pass.** If any step fails, fix the errors before committing. Do NOT:
- Skip steps
- Use `--no-verify`
- Comment out failing code
- Add `@ts-ignore` or `eslint-disable` to silence errors
- Push broken code "to fix later"

### The commit flow:

```
1. Make changes
2. npm run verify        ← ALL THREE MUST PASS
3. git add <files>
4. git commit
5. npm run verify        ← Run again after commit (hooks may have changed files)
6. git push
```

---

## 3. Every File Must Be Valid

**NEVER write raw text, markdown, or prose into a `.tsx`, `.ts`, or `.css` file.**

- `.tsx` files MUST export a valid React component.
- `.ts` files MUST contain valid TypeScript.
- `.css` files MUST contain valid CSS.
- If you need content pages, create a React component that renders the content as JSX.

---

## 4. Project Architecture

```
src/
  main.tsx            # Entry point — DO NOT MODIFY unless adding a provider
  App.tsx             # Root component, routing, shared state, nav
  App.css             # ALL component styles (single stylesheet)
  index.css           # Minimal global reset only
  types.ts            # Shared TypeScript interfaces
  vite-env.d.ts       # Vite type declarations
  [PageName].tsx      # One file per page/tab (PascalCase)
public/
  favicon.svg         # Site icon
  icons.svg           # Icon sprite
index.html            # HTML shell — entry point is /src/main.tsx
tsconfig.json         # TypeScript configuration — strict mode
vite.config.js        # Vite config — base: '/ogpepebot/'
eslint.config.js      # ESLint config — TypeScript rules
```

### Rules:
- **One CSS file**: All styles go in `App.css`. No per-component CSS files.
- **index.css is a reset only**: `box-sizing`, font smoothing, `#root` min-height. No theme colors, no width constraints, no light/dark mode.
- **App.css owns the theme**: All CSS variables live in `:root` at the top of `App.css`.
- **types.ts**: Shared interfaces like `PageProps` go here. Page-specific interfaces stay in their own file.

---

## 5. Component Pattern

Every page component MUST follow this pattern:

```tsx
import { useState } from 'react'
import './App.css'
import type { PageProps } from './types'

interface SomeData {
  // typed interface for page data
}

function PageName({ onNavigate }: PageProps) {
  const [data, setData] = useState<SomeData | null>(null)

  return (
    <div className="pagename-page">
      <div className="pagename-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h1>Page Title</h1>
        <p className="pagename-desc">Description</p>
      </div>
      {/* page content */}
    </div>
  )
}

export default PageName
```

### Rules:
- Import ONLY hooks you use.
- Every page receives `{ onNavigate }: PageProps`.
- Every page wraps in a div with class `pagename-page`.
- Every page has a back button using `className="back-btn"`.
- Export as default.
- All props and state must be typed.

---

## 6. Styling Rules

### Design system (aligned with pepelanding / ogpepe.io)

**Font:** Manrope (loaded from Google Fonts in `index.html`), weights 400, 500, 700, 800.

### Theme colors (defined in App.css `:root`):
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#080c08` | Page background (deep forest green-black) |
| `--surface` | `#0f1610` | Card backgrounds |
| `--surface2` | `#161f17` | Nested/secondary surfaces |
| `--border` | `rgba(255,255,255,0.08)` | All borders (subtle white) |
| `--accent` | `#b2f460` | Primary lime green (buttons, active, positive) |
| `--accent2` | `#7ed348` | Hover/pressed accent |
| `--text` | `#f0f4ed` | Primary text |
| `--text2` | `#aec4a4` | Secondary/body text |
| `--text3` | `#7a9972` | Dim/muted labels |
| `--danger` | `#ff6b6b` | Error/negative states |
| `--radius` | `1.25rem` | Standard card border-radius |
| `--max-w` | `72rem` | Max content width |

### Rules:
- ALWAYS use CSS variables — never hardcode colors.
- Cards: `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: var(--radius)`.
- Buttons: `border-radius: 0.75rem`, `font-weight: 700`, flat colors (NO gradients).
- Badges/pills: `border-radius: 999px`, `font-size: 0.65rem`, uppercase, letter-spaced.
- Transitions: `0.15s` (NOT `0.3s`).
- Background texture: SVG noise overlay via `.bg-pattern`, NOT radial gradients.
- This is a **DARK THEME** site matching pepelanding's forest green palette. Never introduce light backgrounds, cyan, or bright saturated colors.

---

## 7. API & Data Rules

- **No API keys in source code.** Use placeholder `'YourApiKeyToken'` or environment variables.
- **No hardcoded dates or timestamps.** Compute dynamically with `new Date()`.
- **API endpoints must be correct:**
  - PEPE price: `https://api.geckoterminal.com/api/v2/simple/networks/eth/token_price/{address}`
  - Fear & Greed: `https://api.alternative.me/fng/` (JSON, NOT the `.php` page)
  - Etherscan: `https://api.etherscan.io/v2/api?chainid=1&...`
- Wrap all `fetch()` in try/catch with typed error handling.
- Token address: `0x4dFae3690b93c47470b03036A17B23C1Be05127C`
- Wallet address: `0xeB95e661C965095A02E9516c23756DC15F5c58A7`

---

## 8. Deployment

- **Platform:** GitHub Pages
- **CI:** `.github/workflows/deploy.yml` → `npm ci && npm run build` → deploy `dist/`
- **Base path:** `/ogpepebot/` — set in `vite.config.js`, must match.
- **Asset paths in `index.html`**: use base prefix `/ogpepebot/favicon.svg`.
- Build MUST succeed on `ubuntu-latest` with Node 20.

---

## 9. Things That Have Broken Before

| What went wrong | Root cause | Rule |
|----------------|------------|------|
| Build failed on Airdrops page | Raw markdown written into `.jsx` file | Rule 3 |
| `index.css` overrode dark theme | Conflicting CSS variables | Rule 4 |
| Fear & Greed always showed fallback | API URL pointed to HTML page | Rule 7 |
| Reports showed stale date | Hardcoded Unix timestamp | Rule 7 |
| API key leaked in source | Key hardcoded in fetch URL | Rule 7 |
| Favicon 404 on GitHub Pages | Path missing `/ogpepebot/` base | Rule 8 |
| Lint errors on unused imports | Importing unused hooks | Rule 5 |
| Type errors on `onNavigate` | `PageProps` type mismatch with `Tab` union | Rule 5 |
| index.css overrode dark theme | Conflicting light/purple CSS variables | Rule 4: index.css is reset only |
| Styles looked wrong after palette change | Used old variable names (--pepe-green) | Rule 6: use current variable names |

---

## 10. Adding a New Page

1. Create `src/NewPage.tsx` following the component pattern (Rule 5), with typed props.
2. Add styles to `src/App.css` under a `/* NewPage */` comment section.
3. Wire up in `src/App.tsx`:
   - Add import at top
   - Add tab value to the `Tab` type union
   - Add nav button in `<header>`
   - Add conditional render in `<main>`
4. Run `npm run verify` — all three checks must pass.
5. Commit only after step 4 succeeds.

---

## 11. What NOT To Do

- Do NOT create `.js` or `.jsx` files. TypeScript only.
- Do NOT create new CSS files. All styles go in `App.css`.
- Do NOT install new dependencies without clear PEPE value.
- Do NOT modify `vite.config.js` base path.
- Do NOT add `.env` files to git.
- Do NOT use inline styles. Use CSS classes.
- Do NOT introduce CSS frameworks (Tailwind, Bootstrap, etc.).
- Do NOT add `@ts-ignore`, `@ts-expect-error`, or `eslint-disable` comments.
- Do NOT use `any` type. Type everything properly.
- Do NOT commit without running `npm run verify`.
- Do NOT push broken code.
- Do NOT make changes that don't bring value to PEPE or its community.
