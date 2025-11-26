# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fluxion is a flow-based visual programming environment for JavaScript/Node.js built with Vue.js 2 and Electron. Users create data flow networks by connecting nodes on a canvas.

## Development Commands

```bash
# Install dependencies
npm install

# Development (requires two terminals)
npm run watch    # Terminal 1: Parcel build with file watching
npm start        # Terminal 2: Launch Electron app (requires .env file)

# Production
npm run build    # Build to dist/
npm run dist     # Create distributable for current platform
npm run release  # Build and publish release
```

## Architecture

### Core Data Flow Model
- **Nodes**: Computation units with inputs/outputs, defined by `.conf.json` metadata + Vue component
- **Links**: SVG connections between node ports that create Channel pairs
- **Channels** (`src/Channel.js`): Proxy-based pub/sub for async data flow using `input.take()` / `output.put()`

### Global State (window object)
- `window.data[layer]` - Project data array (supports multiple layers)
- `window.current` - Active layer tracking
- `window.engine.inputs/outputs` - Channel registry
- `window.search` - Node search modal state + available node types
- `window.addNode()` / `window.removeLink()` - Canvas manipulation

### Key Components
- `App.vue` - Root canvas with pan/zoom
- `Node.vue` - Node wrapper handling position and selection
- `Link.vue` - SVG path rendering with animated `Packet.vue`
- `Configuration.vue` - Right sidebar for node settings
- `Editor.vue` - CodeMirror editor for node code
- `Menus/` - Electron menu handlers (New, Open, Save, Export)

### Module System (`src/modules/`)
Each node type consists of:
- `.conf.json` - Metadata defining inputs, outputs, default position
- `.vue` - UI rendering component
- Optional `.js` - Execution logic

Available modules: js (generic JavaScript), pug (templates), chartjs (visualization), file-input, webviewnode (scraping), start (trigger)

### Execution
- JavaScript nodes use `eval()` with automatic await injection
- User code accesses `engine.inputs` / `engine.outputs` for data flow
- Errors tracked per-node in `problems` Map

## Creating New Node Types

1. Create `src/modules/mynode.conf.json` with inputs/outputs metadata
2. Create `src/modules/mynode.vue` component
3. Register in `src/index.js` nodeTypes array

## File Format

Projects save as `.fluxion` JSON files containing nodes, links, layout (pan/scale), and styles. A companion `js.js` file stores JavaScript node code.
