# ⚡ NEXUS

**A modern, real-time chat platform built with React.**

Nexus is a feature-rich Discord alternative with a cyberpunk-inspired midnight neon aesthetic. It's built as a single-file React component with zero external dependencies beyond React itself — making it easy to drop into any project.

---

## Features

### Core
- **Multi-server navigation** — Switch between servers with a familiar icon rail, unread badges, and active indicators
- **Channel system** — Organized by collapsible categories, supporting both text and voice channel types
- **Direct messages** — Separate DM view with conversation list, per-user messaging, and unread tracking
- **Real-time messaging** — Send messages with simulated bot responses and typing indicators

### Messages
- **Reply threads** — Reply to specific messages with visual reply chain indicators
- **Edit & delete** — Inline editing for your own messages with keyboard shortcuts (Enter to save, Escape to cancel)
- **Emoji reactions** — Quick-pick emoji panel with toggle-on/toggle-off per user, reaction counts
- **Pin messages** — Pin important messages with visual highlighting and pin badge in header
- **Compact grouping** — Sequential messages from the same user within 5 minutes collapse into a compact layout
- **Date dividers** — Automatic date separators (Today / Yesterday / formatted date)
- **File attachments** — Upload files with preview cards showing name, size, and type
- **Right-click context menus** — Full context menu on any message (Reply, React, Pin, Edit, Delete)

### Voice
- **Voice channel UI** — Join/leave voice channels with connected user display
- **Audio controls** — Mute and deafen toggles with visual state in the user panel and voice status bar
- **Voice status bar** — Persistent bar showing current voice connection with disconnect button

### Navigation & Discovery
- **Global search** — Search across all channels and DMs with highlighted keyword matches
- **User profiles** — Click any avatar for a profile card with bio, status, and quick DM button
- **Scroll management** — Auto-scroll to newest messages with a "New messages" button when scrolled up

### Settings
- **Tabbed settings modal** — Account, Appearance, Notifications, and Keybinds tabs
- **Status picker** — Online, Idle, Do Not Disturb, Offline with color-coded indicators
- **Notification toggles** — Desktop notifications, message sounds, unread badges
- **Theme info** — Midnight Neon theme with density and font scale display

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + M` | Toggle members panel |
| `Ctrl + B` | Toggle channel sidebar |
| `Ctrl + K` | Toggle search |
| `Ctrl + ,` | Open settings |
| `Escape` | Close modals / cancel edit / cancel reply (cascading) |
| `Enter` | Send message / save edit |

### Production Quality
- **State management** — React Context + `useReducer` for predictable, centralized state
- **Accessibility** — ARIA labels, roles (`log`, `article`, `menu`, `dialog`), keyboard navigation, focus management
- **Responsive** — Mobile sidebar overlay, adaptive layout, collapsible panels
- **Performance** — `useMemo` for message grouping, `useCallback` for event handlers, scroll virtualization awareness
- **Zero dependencies** — Only React hooks, no external libraries required
- **Single file** — Drop `nexus-chat.jsx` into any React project

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)

### Setup

```bash
# Create a new Vite + React project
npm create vite@latest nexus-chat -- --template react
cd nexus-chat

# Replace the app entry point
cp /path/to/nexus-chat.jsx src/App.jsx

# Install and run
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Or use in an existing React project

```jsx
import NexusChat from "./nexus-chat";

function App() {
  return <NexusChat />;
}
```

---

## Project Structure

The entire app lives in a single file organized into clear sections:

```
nexus-chat.jsx
├── Theme & Constants    — Color tokens, status metadata, font config
├── Utilities            — ID generation, time formatting, file size formatting
├── Data Models          — Users, servers, channels, DMs, seed messages
├── Context & Reducer    — App state shape, action handlers
├── SVG Icons            — Inline icon components (Hash, Volume, Mic, etc.)
├── Micro Components     — Avatar, Tooltip, IconButton, Badge
├── Server Bar           — Server icon rail with DM shortcut
├── Channel Sidebar      — Channel list, DM list, voice bar, user panel
├── Chat Area            — Header, message list, message input
├── Message Components   — Message display, compact mode, edit mode
├── Members Panel        — Grouped member list by status
├── Search Panel         — Global message search with highlighting
├── Profile Card         — User profile modal
├── Settings Modal       — Tabbed settings with toggles
├── Context Menu         — Right-click action menu
└── Main Export          — Root component with keyboard shortcuts
```

---

## Customization

### Theme
All colors are defined in the `T` object at the top of the file. Update these values to reskin the entire app:

```js
const T = {
  bg0: "#06060e",   // Darkest background (server bar)
  bg1: "#0a0a14",   // Main background
  bg2: "#0e0e1c",   // Sidebar background
  bg3: "#14142a",   // Input/card background
  acc: "#00ffd5",   // Primary accent color
  red: "#ff4466",   // Danger/error color
  grn: "#44ff88",   // Success/online color
  // ...
};
```

### Users & Servers
Edit the `USERS`, `SERVERS`, and `DMS` arrays to configure your own user list, server structure, and direct message channels.

### Bot Responses
The `BOTS` array contains simulated reply messages. Replace these with your own or connect to a real backend.

---

## Connecting to a Backend

This build uses local state with simulated responses. To connect to a real backend:

1. **Replace the reducer** — Swap local state mutations with API calls (REST or WebSocket)
2. **Authentication** — Replace the `ME` constant with a logged-in user from your auth system
3. **Real-time messaging** — Replace the `setTimeout` bot simulation in `MsgInput` with WebSocket listeners
4. **File uploads** — Wire the file input to your storage service (S3, Cloudflare R2, etc.)
5. **Voice** — Integrate WebRTC for actual voice channel functionality

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18+ (hooks only) |
| State | `useReducer` + `useContext` |
| Styling | Inline styles (zero CSS files) |
| Icons | Inline SVG components |
| Fonts | Outfit (display) + JetBrains Mono (code) via Google Fonts |
| Build | Compatible with Vite, CRA, Next.js, or any React setup |

---

## License

MIT
