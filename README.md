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
- **Multiple themes** — Light, Dark, MS-DOS 6.22 Terminal, and NOSTROMO MU-TH-UR 6000 (Alien)
- **Customizable** — Configure font size, user name, LLM name, and header text
- **Pre-prompt scenarios** — Set default instructions to shape your assistant's behavior (custom, Alien roleplay, translator, and more)
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
