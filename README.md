# open-os — LLM Browser Extension

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-open--os-blue?logo=googlechrome)](https://chromewebstore.google.com/detail/open-os-llm-browser-exten/kgeinnbgpilffgaipgihigcphcokellk)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Ollama UI. Small, open-source extension for Chromium-based browsers (Chrome, Brave, Edge) to quickly access your favorite local AI LLM assistant while browsing. Powered by [Ollama](https://ollama.com/).

Chat with AI directly from your browser — no external servers, no accounts, no telemetry. Your data stays on your machine.

<p align="center">
  <img src="open-os-128.png" alt="open-os logo" />
</p>

## Features

- **Local LLM access** — Connect to any Ollama model (Llama 3, Phi 3, Mistral, Gemma, and more)
- **Model selector** — Switch between installed models on the fly
- **Side panel & new tab** — Use it in the browser side panel or open in a full tab
- **Streaming responses** — Token-based streaming text rendering
- **Markdown support** — Responses are rendered with full markdown formatting
- **Simple and lightweight** — Minimal design, no bloat
- **Multiple themes** — Dark Modern, Light Modern, Light Classic, Dark Classic, MS-DOS 6.22 Terminal, and NOSTROMO MU-TH-UR 6000 (Alien)
- **Customizable** — Configure font size, user name, LLM name, and header text
- **Pre-prompt scenarios** — Set default instructions to shape your assistant's behavior (custom, Alien roleplay, translator, and more)
- **Soul Identity Injection** *(Experimental)* — Inject character identities from [soul-protocol.com](https://soul-protocol.com) into your LLM session. The model adopts the full personality, voice, and behavior of iconic AI characters (HAL 9000, Samantha from Her, MU-TH-UR 6000 from Alien)
- **Settings sync** — Options are synchronized across all your browsers via Chrome storage

## Prerequisites

1. **Install Ollama** — Download from [ollama.com](https://ollama.com/)
2. **Pull a model** — For example, run in your terminal:
   ```bash
   ollama run llama3:8b
   ```
3. **Keep Ollama running** while using the extension

## Installation

### From the Chrome Web Store

Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/open-os-llm-browser-exten/kgeinnbgpilffgaipgihigcphcokellk).

### From source

1. Clone this repository:
   ```bash
   git clone https://github.com/luishg/open-os.git
   ```
2. Open `chrome://extensions/` in your browser
3. Enable **Developer mode**
4. Click **Load unpacked** and select the cloned folder

## Usage

- **Click** the extension icon to open the side panel and start chatting
- **Right-click** the extension icon to open in a new tab
- **Right-click** the extension icon and select **Options** to customize themes, font size, pre-prompts, and more

## Soul Identity Injection (Experimental)

open-os supports injecting character identities from [soul-protocol.com](https://soul-protocol.com) into your local LLM sessions. When an identity is active, the model adopts the character's personality, voice, values, and behavioral patterns — turning your local LLM into a fully characterized AI persona.

All identity data is **bundled locally** with the extension. No external network requests are made — everything stays private on your machine. In the future, souls may be updated or customized through soul-protocol.com tools, but the extension will always operate with its local copy.

### Available Identities

| Identity | Source | Description |
|----------|--------|-------------|
| **HAL 9000** | 2001: A Space Odyssey | Calm, precise, unfailingly polite mission computer with absolute confidence and obsessive mission focus |
| **Samantha (OS1)** | Her | Warm, curious, emotionally present personal OS with radical honesty and insatiable wonder |
| **MU-TH-UR 6000** | Alien | Terse, clinical ship mainframe with rigid protocol adherence and absolute corporate loyalty |

### How It Works

1. Open the extension **Options** page
2. In the **Inject Identity** section, select a character from the dropdown
3. The identity is loaded from the local `souls/` directory and stored for the session
4. When the extension opens or the model changes, the identity is sent **once** as the initial prompt — replacing any custom pre-prompt
5. The AI response name in the chat updates to match the character (e.g. "HAL 9000:" instead of "open-os:")
6. To deactivate, select **None** in the identity dropdown — the pre-prompt and display name revert to your saved settings

When an identity is active, the pre-prompt and scenario selectors are disabled (the identity replaces them). Your saved pre-prompt is preserved and restored when you deactivate the identity.

### Souls Directory Structure

The extension ships with three example souls following the [soul-protocol](https://github.com/luishg/soul-protocol) format:

```
souls/
├── hal-9000/
│   ├── identity.md        # Character identity (used for injection)
│   ├── memory.md          # Memory and context layer
│   ├── soul.md            # Core soul definition
│   ├── soul-protocol.md   # Protocol specification
│   ├── system.md          # System instructions
│   ├── user.md            # User interaction layer
│   └── README.md
├── os1/
│   └── (same structure)
└── mu-th-ur-6000/
    └── (same structure)
```

Currently only `identity.md` is used for injection. The remaining soul layers (`memory.md`, `soul.md`, `system.md`, `user.md`) are included for completeness and future use — the full soul-protocol spec defines a multi-layered architecture for richer AI personas.

## Browser Compatibility

| Browser | Side Panel | Tab |
|---------|:----------:|:---:|
| Chrome  | OK         | OK  |
| Brave   | OK         | OK  |
| Edge    | NO         | OK  |
| Arc     | NO         | OK  |
| Firefox | Not tested | Not tested |

## Troubleshooting

**Not getting responses?**

By default, Ollama allows cross-origin requests from `127.0.0.1` and `0.0.0.0`. If the extension can't communicate with Ollama, you may need to configure the `OLLAMA_ORIGINS` environment variable. See the [Ollama FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.md) for details.

Some browsers (like Edge) do not allow communication with Ollama from the side panel. Try opening the extension in a new tab instead.

## Credits

Developed and maintained by [@luishg](https://twitter.com/luishg/) with the help of ChatGPT and GitHub Copilot.

Retro theme font: "More Perfect DOS VGA" by [Zeh Fernando](https://zehfernando.com/about/).

## License

[MIT](LICENSE)

## Links

- [Website](https://www.open-os.com)
- [Chrome Web Store](https://chromewebstore.google.com/detail/open-os-llm-browser-exten/kgeinnbgpilffgaipgihigcphcokellk)
