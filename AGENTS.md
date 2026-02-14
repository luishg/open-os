# AGENTS.md

## Project
`open-os` is a production Manifest V3 Chrome extension for local Ollama chat in side panel, new tab, and standalone page modes.

- Stack: vanilla HTML/CSS/JS, no build step
- Runtime: Chrome extension APIs + Ollama local API (`http://localhost:11434`)
- External lib: `lib/marked.min.js` only
- Privacy: local-first, no telemetry, no external servers

## Architecture Map
- `open-os.js`: core chat logic, Ollama API calls, streaming parser, theme apply, storage listeners
- `panel.html`: primary UI entry (side panel)
- `open-os.html`: standalone/legacy page
- `background.js`: service worker, context menu, side panel behavior
- `options.html` + `options.js`: settings UI and persistence
- `themes/*`: self-contained themes (CSS, optional JS/fonts/sounds)
- `themes/nostromo/nostromo.js`: theme-specific sounds and DOM observers
- `souls/*`: local identity assets for experimental Soul Identity Injection

## Hard Constraints
1. Keep it production-safe and backward compatible.
2. Do not remove or break `rebuildRules()` (`declarativeNetRequest` origin rewrite).
3. Keep `chrome.runtime` guards for extension vs standalone compatibility.
4. Preserve existing `chrome.storage` keys and behavior (`sync` for prefs, `local` for model).
5. Maintain Ollama API contracts (`/api/chat` streaming NDJSON, `/api/tags`).
6. No frameworks, no transpilation, no new build tooling.
7. No remote scripts, no `eval`, no CSP-violating patterns.
8. Do not add extension permissions/host permissions unless strictly required and documented.

## UI and Message Semantics
- Primary target is narrow side panel (~300-400px) plus full-tab and standalone support.
- Chat structure in `#chatlog`:
  - User: `<p class="chat-user">`
  - AI: `<div class="chat-response">` (must remain a div for markdown block rendering)
  - System: `<div class="chat-system">` or `<p class="chat-system">`
- In CSS, prefer class-based selectors (`.chat-response`) not element-specific (`p.chat-response`).
- Theme changes must be validated across all shipped themes.

## Streaming and Context Flow
1. Prompt submit builds `{ model, messages }`
2. POST to Ollama `/api/chat`
3. Parse streaming NDJSON via `ReadableStream`
4. Render incremental text while streaming
5. Finalize with markdown rendering (`marked.parse`)
6. Persist conversation history in `chatMessages`

Do not refactor this flow without full-path validation.

## Soul Identity Injection
- Identity assets are bundled locally under `souls/`.
- Current injection source is `identity.md` per selected identity.
- Identity mode overrides pre-prompt behavior; preserve restore logic when deactivated.

## Change Workflow For Codex
1. Read full target files before edits.
2. Trace impact across `open-os.js`, `options.js`, `background.js`, and active theme CSS.
3. Keep edits small, explicit, and consistent with existing style.
4. Verify behavior in all contexts touched: side panel, tab, standalone.
5. If DOM structure changes, check NOSTROMO theme compatibility.
6. Avoid renaming IDs/classes/storage keys unless migration is intentional and handled.

## Testing Checklist (Manual)
- Extension loads in side panel and tab.
- Model list loads from `/api/tags`.
- Chat streams from `/api/chat` and markdown renders correctly.
- Theme switching works (including NOSTROMO assets/behavior).
- Settings persist and sync (`chrome.storage.sync`), model persists (`chrome.storage.local`).
- Runtime setting changes apply live (`chrome.storage.onChanged`).
- No layout breakage at narrow widths.

## Design Direction
Favor a modern sci-fi terminal/HCI feel. Motion and visual effects are acceptable if purposeful and lightweight.
