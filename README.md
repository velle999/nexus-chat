# ⚡ NEXUS P2P

**Serverless peer-to-peer chat in a single HTML file.**

Nexus P2P is a fully decentralized chat app built on WebRTC. No servers, no accounts, no databases — just direct browser-to-browser connections. Open the file, create a room, share the code.

---

## How It Works

1. **Create a room** — Enter your name, pick a color, click "Create Room"
2. **Share the 6-character code** — Click to copy, send it however you want
3. **Others join** — They open the same file, enter the code, and connect directly to you
4. **Mesh networking** — Peers automatically discover and connect to each other, forming a full mesh

All messages travel directly between browsers. The only external service is PeerJS's public signaling server, which brokers the initial WebRTC handshake — it never sees your messages.

## Features

- **Real-time messaging** with typing indicators
- **Emoji reactions** — toggle per-user, synced across all peers
- **Edit & delete** your own messages
- **Message history sync** — new joiners receive the full chat log from existing peers
- **System messages** — join/leave notifications
- **Member panel** — see who's connected with live status
- **Room code sharing** — click to copy with toast confirmation
- **Responsive layout** — mobile sidebar, collapsible members panel
- **Keyboard shortcuts** — `Ctrl+M` toggles members

## Quick Start

No build step. No install. Just open the file.

```
Open nexus-p2p.html in any modern browser
```

To test locally, open it in two tabs — create a room in one, join with the code in the other.

### Hosting

To let people connect from different networks, host the file anywhere static:

- **GitHub Pages** — push to a repo, enable Pages
- **Netlify / Vercel** — drag and drop
- **Any web server** — it's a single HTML file

The file loads two external resources via CDN:
- Google Fonts (Outfit + JetBrains Mono)
- PeerJS 1.5.4

Everything else is inline.

## Architecture

```
┌──────────┐    WebRTC Data Channel    ┌──────────┐
│ Browser A │◄────────────────────────►│ Browser B │
└──────────┘                           └──────────┘
      ▲              ▲                       ▲
      │              │                       │
      └──────────────┼───────────────────────┘
                     │
          PeerJS Signaling Server
          (handshake only, no message data)
```

- **Connection:** PeerJS handles WebRTC signaling via a public server. Once the peer connection is established, all data flows directly between browsers.
- **Mesh:** When a third peer joins, existing peers share their peer lists. Every peer connects to every other peer — no single point of failure.
- **Sync:** New peers receive the full message history from whoever they connect to first.
- **Protocol:** All peer communication uses JSON over WebRTC DataChannels. Message types: `hello`, `sync`, `message`, `typing`, `reaction`, `edit`, `delete`, `peer-list`.

## Message Protocol

| Type | Direction | Description |
|------|-----------|-------------|
| `hello` | Bidirectional | Exchange user info on connection |
| `sync` | To new peer | Send full message history |
| `message` | Broadcast | New chat message |
| `typing` | Broadcast | Typing indicator |
| `reaction` | Broadcast | Toggle emoji reaction |
| `edit` | Broadcast | Edit own message content |
| `delete` | Broadcast | Delete own message |
| `peer-list` | To new peer | Share known peers for mesh expansion |

## Limitations

- **No persistence** — messages exist only in connected browsers' memory. Close all tabs and they're gone.
- **NAT traversal** — WebRTC usually works across networks via STUN/TURN, but restrictive firewalls may block connections. PeerJS uses Google's public STUN servers by default.
- **Scale** — WebRTC mesh works well for small groups (2–15 peers). Beyond that, bandwidth scales quadratically.
- **No encryption at rest** — messages are encrypted in transit by WebRTC's built-in DTLS, but stored in plaintext in browser memory.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Networking | WebRTC DataChannels via PeerJS |
| Signaling | PeerJS public server (handshake only) |
| UI | Vanilla HTML/CSS/JS (no framework) |
| Fonts | Outfit + JetBrains Mono (Google Fonts CDN) |
| Build | None — single self-contained HTML file |

## License

MIT
