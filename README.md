# OpenCode Studio

A desktop GUI for the [opencode](https://opencode.ai) CLI tool, targeting Unity, web, and mobile developers. Built with Tauri 2, React, TypeScript, and Tailwind CSS.

![OpenCode Studio](public/tauri.svg)

## Overview

OpenCode Studio wraps the `opencode` CLI with a polished desktop interface, giving you:

- **AI-powered code analysis** — send natural-language prompts about your project to opencode
- **Multi-project workspace** — manage and switch between recent projects
- **File Explorer** — browse your project's file tree with syntax-coloured icons
- **Real-time Logs** — see every process event as it happens
- **Quick Actions** — one-click prompts for General, Unity, Web, and Mobile workflows
- **Changed Files panel** — ready to connect to filesystem-watch events
- **Settings** — configure the opencode executable path, auto-scroll, and font size

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Tauri 2 |
| UI framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 3 |
| State | Zustand 4 (with persist middleware) |
| Routing | React Router v6 |
| Icons | lucide-react |
| Linting | ESLint 8 + Prettier 3 |

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Rust](https://rustup.rs/) (stable toolchain)
- [Tauri CLI prerequisites](https://tauri.app/v2/guides/getting-started/prerequisites/) for your OS
- [`opencode`](https://opencode.ai) CLI installed and available in `PATH` (or configured in Settings)

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-org/OpenCode-Studio.git
cd OpenCode-Studio

# 2. Install Node dependencies
npm install

# 3. Run in development mode (opens the Tauri window with HMR)
npm run tauri dev
```

> **First launch** — an onboarding wizard walks you through verifying your `opencode` installation and opening your first project.

## Building for Production

```bash
npm run tauri build
```

Installers are written to `src-tauri/target/release/bundle/`.

## Project Structure

```
OpenCode-Studio/
├── src/                        # React frontend
│   ├── features/
│   │   ├── chat/               # ChatPanel + PromptInput
│   │   ├── explorer/           # FileTree
│   │   ├── logs/               # LogsPanel
│   │   ├── quick-actions/      # QuickActions
│   │   ├── workspace/          # ChangedFilesPanel
│   │   └── settings/           # SettingsForm
│   ├── hooks/                  # useOpencode, useFileExplorer
│   ├── layouts/                # AppShell
│   ├── lib/                    # utils, quickActions
│   ├── pages/                  # MainPage, OnboardingPage, SettingsPage
│   ├── services/               # opencodeService (Tauri invoke wrappers)
│   ├── stores/                 # Zustand stores (app, chat, logs, explorer)
│   ├── types/                  # Shared TypeScript types
│   └── styles/                 # globals.css (Tailwind + Google Fonts)
├── src-tauri/                  # Rust / Tauri backend
│   ├── src/
│   │   ├── commands/
│   │   │   ├── workspace.rs    # File tree walk, file read, folder picker
│   │   │   └── process.rs      # opencode subprocess runner, version check
│   │   ├── types.rs            # Shared Rust types (serde)
│   │   └── lib.rs              # Tauri builder + plugin registration
│   ├── capabilities/
│   │   └── default.json        # Tauri permission set
│   └── tauri.conf.json         # Window config, bundle targets
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## opencode Integration

OpenCode Studio invokes the `opencode` CLI as a subprocess:

```
opencode run --print "<prompt>"
```

The process runs with `cwd` set to the selected project folder. `stdout` is captured and shown in the chat panel; `stderr` lines are forwarded to the Logs panel as warnings.

> If your version of `opencode` uses a different invocation style, edit `src-tauri/src/commands/process.rs` → `run_opencode`.

### Configuring the executable

- Default: `opencode` (must be on `PATH`)
- Override in **Settings → OpenCode Executable** or during the onboarding wizard
- The **Check Installation** button runs `opencode --version` to verify availability

## Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (frontend only, no Tauri window) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run tauri dev` | Full Tauri dev mode with HMR |
| `npm run tauri build` | Production build + native installers |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## Architecture Notes

### State Management

Four Zustand stores keep state modular:

| Store | Responsibility |
|---|---|
| `appStore` | Onboarding flag, current project, recent projects, settings (persisted to localStorage) |
| `chatStore` | Chat messages, processing flag |
| `logsStore` | Log entries, process status |
| `explorerStore` | File tree, selected file, search query |

### Tauri Commands

| Command | Description |
|---|---|
| `get_project_files` | Directory walk → `FileNode` tree |
| `read_file_content` | Read text file (≤ 1 MB) |
| `select_folder` | Native folder-picker dialog |
| `run_opencode` | Spawn opencode subprocess |
| `check_executable` | Verify executable exists |
| `get_app_version` | Return Cargo package version |

Tauri events emitted from the backend:

| Event | Payload |
|---|---|
| `process-log` | `{ level, message, source }` |

### Quick Actions

30 pre-built prompts across four categories (General, Unity, Web, Mobile) live in `src/lib/quickActions.ts`. Add or edit entries there — no backend changes needed.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push and open a Pull Request

## License

MIT
