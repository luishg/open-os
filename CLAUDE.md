# open-os — CLAUDE.md

## Project Overview

**open-os** is a production Chrome Web Store extension that provides a local LLM chat interface (powered by Ollama) directly in Chromium-based browsers. It runs as a side panel, a new tab, or a standalone window. No external servers, no accounts, no telemetry — all data stays on the user's machine.

- **Chrome Web Store**: [open-os](https://chromewebstore.google.com/detail/open-os-llm-browser-exten/kgeinnbgpilffgaipgihigcphcokellk)
- **Website**: [open-os.com](https://www.open-os.com)
- **License**: MIT

## Tech Stack

- **Manifest V3** Chrome Extension (no build step, no bundlers)
- **Vanilla HTML, CSS, JavaScript** — no frameworks, no transpilation
- **Ollama API** (`localhost:11434`) — `/api/generate` for streaming chat, `/api/tags` for model listing
- **Chrome Extension APIs**: `storage` (sync + local), `sidePanel`, `contextMenus`, `declarativeNetRequest`
- **marked.min.js** — only external library, used for markdown rendering
- **Custom fonts**: MorePerfectDOSVGA (retro theme), Berthold City Light (NOSTROMO theme)

## Project Structure

```
open-os/
├── manifest.json          # Extension manifest (Manifest V3) — permissions, host_permissions, side_panel config
├── background.js          # Service worker — context menus, side panel behavior
├── panel.html             # Main chat UI (loaded in side panel and new tab)
├── open-os.html           # Legacy/standalone chat page
├── open-os.js             # Core application logic — Ollama API, streaming, chat, themes, settings
├── options.html           # Extension options page (themes, pre-prompts, customization)
├── options.js             # Options page logic — save/load settings via chrome.storage.sync
├── lib/
│   └── marked.min.js      # Markdown parser (only external library)
├── themes/                # All themes live here — one subfolder per theme
│   ├── light/
│   │   └── light.css              # Light theme (default)
│   ├── dark/
│   │   └── dark.css               # Dark theme
│   ├── dark-modern/
│   │   └── dark-modern.css        # Dark Modern (premium gradients, glassmorphism, glow effects)
│   ├── light-modern/
│   │   └── light-modern.css       # Light Modern (clean light UI, soft shadows, modern depth)
│   ├── retro/
│   │   ├── retro.css              # MS-DOS 6.22 retro terminal (CRT scanlines, text flicker)
│   │   └── MorePerfectDOSVGA.ttf  # Retro theme font
│   └── nostromo/
│       ├── nostromo.css           # NOSTROMO MU-TH-UR 6000 (Alien aesthetic, green phosphor)
│       ├── nostromo.js            # Sound effects and MutationObserver for typing sounds
│       ├── Berthold City Light Regular.otf  # NOSTROMO theme font
│       ├── City Light Light.ttf   # Alternate font
│       └── sounds/                # NOSTROMO sound effects
│           ├── alien_atm.mp3
│           ├── alien_keys.mp3
│           ├── beep.wav
│           ├── boot.mp3
│           ├── login_alien.mp3
│           └── rn_cr_alien.mp3
└── open-os-128.png        # Extension icon
```

## Key Architecture Concepts

### Communication & Compatibility

- **`declarativeNetRequest`** is used to set the `Origin` header to `http://localhost` so the extension can communicate with the Ollama server from the `chrome-extension://` origin. This is critical — do not remove or alter `rebuildRules()`.
- **`chrome.runtime`** guards (`typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id`) protect code paths that only work inside the extension context. These guards allow `open-os.html` to also function outside the extension.
- **`chrome.storage.sync`** stores user preferences (theme, username, pre-prompt, font size) and syncs across browsers. **`chrome.storage.local`** stores the selected model.
- **Side panel** is the primary UI surface (`panel.html`). Context menu provides "Open Tab" for a full-tab experience.

### Streaming & Chat Flow

1. User submits prompt via input field (Enter key or send button)
2. `submitRequest()` builds the payload with `{ model, prompt, context }`
3. `postRequest()` sends POST to Ollama's `/api/generate`
4. `getResponse()` reads the streaming response via `ReadableStream`, parsing NDJSON line by line
5. Each token is appended to the chat with a `<span class="cursor-flash">` for typing animation
6. On completion (`parsedResponse.done`), the full response is parsed through `marked.parse()` for markdown
7. `context` from the response is stored on the chatlog DOM element for conversation continuity

### Theme System

- All themes live under `themes/<name>/` — each subfolder is self-contained with its CSS, fonts, sounds, and optional JS
- Themes are swapped by changing the `href` of a `<link id="theme">` tag (e.g. `themes/dark/dark.css`)
- The NOSTROMO theme dynamically loads `themes/nostromo/nostromo.js` (sound effects, MutationObserver)
- Each theme CSS is self-contained and defines all UI element styles
- All themes include a custom `.spinner` animation for loading states
- To add a new theme: create `themes/<name>/`, add its CSS (and optional JS/fonts/sounds), register it in `options.html` and `open-os.js:applyTheme()`

### Chat Message Structure

Chat messages in `#chatlog` use different HTML elements and CSS classes:

- **User messages**: `<p class="chat-user">` — plain text with `<b>username:</b>` prefix
- **AI responses**: `<div class="chat-response">` — a `<div>` container (not `<p>`) because `marked.parse()` produces block-level elements (`<p>`, `<pre>`, `<ul>`, etc.) inside it. Nesting `<p>` inside `<p>` is invalid HTML and causes rendering bugs (doubled padding, broken layout).
- **System messages**: `<div class="chat-system">` or `<p class="chat-system">` — connection status, errors, model loaded. The initial status line has `id="system-status"` so JS can append to it (e.g. "Connecting... **model** loaded.")

When writing theme CSS:
- Use `.chat-user`, `.chat-response`, `.chat-system` (element-agnostic selectors) — not `p.chat-response`
- Style `#chatlog .chat-response p` for markdown paragraphs inside AI responses
- Themes that don't reference these classes are unaffected — they are additive

### Options & Settings

- Options are saved via `chrome.storage.sync` and immediately available to the chat panel
- `chrome.storage.onChanged` listener in `open-os.js` applies theme/font changes in real-time
- Pre-prompt scenarios (custom, Alien roleplay, translator) are defined in `options.js`

---

## Rules & Guidelines

### 1. PRODUCTION SAFETY — Do Not Break What Works

This extension is **live on the Chrome Web Store** with real users. Every change must be:

- **SAFE**: Test mentally against all execution paths before committing. Consider side panel, new tab, and standalone contexts.
- **SOLID**: No half-implemented features. If a change touches streaming, storage, or theme loading, verify the full flow still works.
- **Backwards-compatible**: Existing `chrome.storage` keys, Ollama API calls, message flows, and DOM element IDs are stable contracts. Changing them breaks users' saved settings and active sessions.

Before any change, **read and understand** the existing code paths it touches. Understand how `options.js`, `open-os.js`, `background.js`, and the theme CSS files interact.

### 2. PURE FRONTEND — Vanilla HTML, CSS, JS

- **No frameworks, no build tools, no transpilers.** This is intentional — the codebase must stay readable, lightweight, and easy for anyone to maintain.
- Keep JavaScript simple and direct. Avoid over-abstraction.
- Use the existing patterns: DOM manipulation, event listeners, `chrome.storage` for state.
- The only external library is `marked.min.js`. Adding new libraries requires strong justification.

### 3. RESPONSIVE DESIGN — Side Panel is the Primary Target

The chat UI must work in:

- **Side panel** (~300-400px wide, full height)
- **New tab** (full browser width)
- **Small popup windows** (various sizes)

This means:

- Use relative units (`%`, `rem`, `vw`) over fixed pixel widths where possible
- Be careful with `float`, `position`, `width`, and `display` properties — test at narrow widths
- Elements must not overflow or break at small sizes. The input field, buttons, and model selector must remain usable
- The chatlog must scroll properly at any height
- Every CSS change must be verified across all themes (light, light-modern, dark, dark-modern, retro, nostromo)

### 4. CHROME EXTENSION COMPATIBILITY — Do Not Break the Bridge

- The **`declarativeNetRequest` rules** (`rebuildRules`) and **`chrome.runtime` guards** are compatibility-critical code. Do not refactor, remove, or simplify these without deep understanding of why they exist.
- All cross-origin communication with Ollama depends on the origin header rewriting. Breaking this silently kills the extension.
- `chrome.sidePanel`, `chrome.contextMenus`, `chrome.storage` APIs must be used per their documented behavior.
- Test that changes work in both the extension context and when `open-os.html` is opened as a regular file.

### 5. CHROME WEB STORE COMPLIANCE

All code must pass the **Chrome Web Store review**. This means:

- **No remote code execution** — all JS must be bundled locally (no CDN script tags, no `eval()`)
- **Minimal permissions** — do not add new permissions to `manifest.json` unless absolutely necessary, and document why
- **No unnecessary host permissions** — currently scoped to `localhost:11434` only
- **Content Security Policy** compliance — no inline scripts in HTML files, no unsafe-eval
- **Privacy**: no telemetry, no analytics, no external network calls (Ollama is local only)
- New capabilities that require new permissions must be researched against Chrome Extension docs before implementation

### 6. READ BEFORE YOU WRITE

- **Always read the full file** before modifying it. Understand the existing functions, event listeners, and DOM dependencies.
- Check for **deprecated code** (marked with `//DEPRECATED` comments) — it exists for historical context, do not rely on it for new features.
- The `context` property is stored on the DOM element (`chatlog.context`) — this is intentional for conversation continuity with Ollama.
- Sound effects and MutationObserver in `themes/nostromo/nostromo.js` are theme-specific — changes to chatlog DOM structure can break the NOSTROMO experience.

### 7. DESIGN VISION — Sci-Fi Human-Computer Interface

The project aesthetic is **modern, futuristic, and cinematic**:

- Think sci-fi computer terminals, holographic interfaces, retro-futurism
- The NOSTROMO theme (Alien's MU-TH-UR 6000) sets the tone: CRT scanlines, phosphor glow, typing sounds, boot sequences
- New themes and UI enhancements should push toward this sci-fi vision of human-computer communication from your browser
- Design should feel like interacting with an AI through a ship's terminal, a hacker console, or a cyberpunk HUD
- Animations, transitions, and visual feedback are welcome when they serve the experience (not gratuitous)
- Typography matters — each theme has its own font personality

### 8. DOCUMENTATION & REFERENCES

When writing code that interacts with these systems, consult their documentation:

- **Chrome Extensions Manifest V3**: permissions, service workers, side panel API, storage API, declarativeNetRequest
- **Ollama API**: `/api/generate` (streaming), `/api/tags` (model listing), CORS configuration
- **marked.js**: markdown parsing options and security considerations
- **Web standards**: Fetch API streaming, ReadableStream, NDJSON parsing

---

## Quick Reference

| What | Where |
|---|---|
| Main chat logic | `open-os.js` |
| Ollama API calls | `open-os.js:postRequest()`, `open-os.js:getResponse()`, `open-os.js:getModels()` |
| Streaming parser | `open-os.js:getResponse()` — NDJSON line-by-line via ReadableStream |
| Theme switching | `open-os.js:applyTheme()` — swaps CSS `<link>` href |
| Settings persistence | `chrome.storage.sync` (preferences) / `chrome.storage.local` (model) |
| Origin header fix | `open-os.js:rebuildRules()` — declarativeNetRequest |
| Side panel entry | `panel.html` -> loads theme CSS + marked.js + open-os.js |
| Context menu | `background.js` — "Open Tab" action |
| Options page | `options.html` + `options.js` |
| NOSTROMO sounds | `themes/nostromo/nostromo.js` — loaded dynamically when NOSTROMO theme is active |
| Themes | `themes/light/`, `themes/dark/`, `themes/dark-modern/`, `themes/light-modern/`, `themes/retro/`, `themes/nostromo/` |
