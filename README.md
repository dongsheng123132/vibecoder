# VibeCoder — Cyberpunk AI Command Console

<p align="center">
  <strong>⌨️ A floating desktop command console for AI coding tools</strong>
</p>

<p align="center">
  Electron + React 18 + Vite &nbsp;|&nbsp; macOS &nbsp;|&nbsp; Cyberpunk UI
</p>

---

VibeCoder is a desktop floating keyboard that sends pre-built commands directly to your AI coding tools — **Cursor**, **VS Code + Copilot**, **Claude Code CLI**, **Kimi CLI**, **Trae**, **Windsurf**, and any terminal.

Instead of typing the same prompts over and over, just click a button. VibeCoder detects your active window, picks the right recipe (e.g. `Cmd+L` → paste → Enter for Cursor), and sends the command automatically.

## Features

- **Floating Window** — Always-on-top, frameless, transparent, draggable. Toggle with `Cmd+Shift+K`
- **Multi-Tool Adapter** — Auto-detects Cursor / VS Code / Terminal / Claude Code CLI / Kimi CLI and sends commands using each tool's native shortcut sequence
- **36 Pre-built Commands** across 6 categories: Quick Reply, Code Review, Instruction Control, Debug, Feature Dev, Project Management
- **Tool-Aware Variants** — Same button sends different text depending on the target tool (e.g. "继续" → "继续执行，直到没有错误" for Claude Code CLI)
- **Workflow Engine** — Chain multiple commands with 2-second intervals. 3 presets + custom editor
- **Stats Dashboard** — 7-day activity chart, hourly heatmap, top 5 commands (powered by Recharts)
- **Gamification** — XP system, Lv.1→Lv.99, combo counter with neon animations, daily streaks
- **Smart Sorting** — Frequently used commands float to the top
- **System Tray** — Minimize to tray, quick toggle
- **Window Memory** — Remembers position and size across sessions

## Screenshots

```
┌──────────────────────────────────┐
│ ⌨️ VIBECODER              ─  ✕  │  ← Custom title bar (draggable)
├──────────────────────────────────┤
│ [🔍 Search...]                   │
│ [📊 Stats] [🔗 Workflow] [✏️]   │
├──────────────────────────────────┤
│ ⚡快捷 🔍审查 🎯指令 🐞调试 ... │  ← Category tabs
├──────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ ▶️   │ │ 👍   │ │ ✅   │      │  ← Command grid
│ │ 继续 │ │ 好的 │ │ 请继续│      │
│ └──────┘ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ 🛑   │ │ ↩️   │ │ 🇨🇳  │      │
│ │ 停下  │ │ 撤销 │ │ 说中文│      │
│ └──────┘ └──────┘ └──────┘      │
├──────────────────────────────────┤
│ 🟢 Cursor  │ 5x COMBO │ Lv.12  │  ← Status bar
└──────────────────────────────────┘
```

## Quick Start

```bash
# Install dependencies
npm install

# Start dev mode (launches Electron window)
npm run dev

# Build for production
npm run build
```

**Requirements:** macOS (uses AppleScript for window detection & input simulation), Node.js 18+

## How It Works

1. VibeCoder detects your last active window (every 1 second via AppleScript)
2. You click a command button
3. VibeCoder copies the text to clipboard
4. Switches to the target app
5. Executes the tool-specific recipe:
   - **Cursor**: `Cmd+L` (open chat) → `Cmd+V` (paste) → `Enter` (send)
   - **VS Code**: `Cmd+I` (open Copilot) → `Cmd+V` → `Enter`
   - **Terminal / Claude Code / Kimi**: `Cmd+V` → `Enter`

## Supported Tools

| Tool | Type | Send Method |
|------|------|------------|
| Cursor | Editor | Cmd+L → Paste → Enter |
| VS Code + Copilot | Editor | Cmd+I → Paste → Enter |
| Trae | Editor | Paste → Enter |
| Windsurf | Editor | Paste → Enter |
| Claude Code CLI | Terminal | Paste → Enter |
| Kimi CLI | Terminal | Paste → Enter |
| Terminal (generic) | Terminal | Paste → Enter |

## Tech Stack

- **Electron** — Desktop app framework
- **React 18** — UI components
- **Vite** + **vite-plugin-electron** — Fast dev & build
- **electron-store** — Persistent data (stats, settings, gamification)
- **Recharts** — Statistics charts
- **AppleScript** — macOS window detection & keyboard simulation

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Cmd+Shift+K` | Toggle VibeCoder window |
| `1-6` | Quick-send command in current category |

## Project Structure

```
├── electron/
│   ├── main.js              # Main process
│   ├── preload.js            # IPC bridge
│   ├── windowDetector.js     # Active window detection
│   └── inputSimulator.js     # Keystroke simulation
├── src/
│   ├── App.jsx               # Main app
│   ├── components/           # UI components
│   ├── data/                 # Commands & tool recipes
│   └── hooks/                # Stats, gamification, window detection
```

## License

MIT

---

# VibeCoder — 赛博朋克 AI 指令控制台

<p align="center">
  <strong>⌨️ AI 编程工具的桌面悬浮指令键盘</strong>
</p>

---

VibeCoder 是一个桌面悬浮键盘，可以直接往你的 AI 编程工具发送预设命令 —— 支持 **Cursor**、**VS Code + Copilot**、**Claude Code CLI**、**Kimi CLI**、**Trae**、**Windsurf** 以及任意终端。

不用再反复手敲同样的提示词，点一下按钮就搞定。VibeCoder 自动检测你当前的活动窗口，选择对应的发送方式（比如 Cursor 会先 `Cmd+L` 打开对话框），然后自动粘贴发送。

## 功能特性

- **悬浮窗** — 始终置顶、无边框、透明、可拖动。`Cmd+Shift+K` 一键呼出/隐藏
- **多工具适配** — 自动检测 Cursor / VS Code / 终端 / Claude Code CLI / Kimi CLI，用各自的快捷键序列发送命令
- **36 条预设命令**，分 6 个类别：快捷回复、代码审查、指令控制、调试排错、功能开发、项目管理
- **工具感知变体** — 同一个按钮，不同工具发不同文案（例如 "继续" 在 Claude Code 里变成 "继续执行，直到没有错误"）
- **工作流引擎** — 多条命令串联自动发送（间隔 2 秒）。3 个预设流程 + 自定义编辑器
- **统计仪表盘** — 7 天活跃度折线图、24 小时热力图、TOP 5 高频命令（Recharts 驱动）
- **游戏化系统** — 经验值、Lv.1→Lv.99 等级、连击计数器（霓虹动画）、每日连续使用天数
- **智能排序** — 高频命令自动排在前面
- **系统托盘** — 最小化到托盘，快速切换
- **记忆窗口位置** — 下次打开还在老地方

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发模式（自动打开 Electron 窗口）
npm run dev

# 构建生产版本
npm run build
```

**系统要求：** macOS（使用 AppleScript 进行窗口检测和键盘模拟），Node.js 18+

## 工作原理

1. VibeCoder 每秒检测你最后一个活动窗口（通过 AppleScript）
2. 你点击命令按钮
3. VibeCoder 将文本复制到剪贴板
4. 切换回目标应用
5. 执行对应的发送配方：
   - **Cursor**: `Cmd+L`（打开 Chat）→ `Cmd+V`（粘贴）→ `Enter`（发送）
   - **VS Code**: `Cmd+I`（打开 Copilot）→ `Cmd+V` → `Enter`
   - **终端 / Claude Code / Kimi**: `Cmd+V` → `Enter`

## 技术栈

- **Electron** — 桌面应用框架
- **React 18** — UI 组件
- **Vite** + **vite-plugin-electron** — 快速开发和构建
- **electron-store** — 持久化存储（统计、设置、游戏化数据）
- **Recharts** — 统计图表
- **AppleScript** — macOS 窗口检测和键盘模拟

## 开源协议

MIT
