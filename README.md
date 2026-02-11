# ⚡ NEXUS P2P

**Peer-to-peer chat with voice — in a single HTML file.**

Nexus P2P is a decentralized chat app with push-to-talk voice chat. It uses WebRTC for direct peer-to-peer connections when possible, and automatically falls back to a WebSocket relay when it can't punch through VPNs or strict firewalls. No servers to deploy, no accounts, no databases — open the file, create a room, share the code.

---

## How It Works

1. **Create a room** — Enter your name, pick a color, click "Create Room"
2. **Share the 6-character code** — Click to copy, send it however you want
3. **Others join** — They open the same file, enter the code, and connect
4. **Chat + voice** — Text chat is always on; join voice and hold to talk

Both transports start in parallel. If direct P2P succeeds, you get the fastest path. If it fails (VPNs, symmetric NAT, corporate firewalls), the MQTT relay kicks in transparently — same chat, same features, just routed differently.

## Features

### Text Chat
- Real-time messaging with typing indicators
- Emoji reactions — toggle per-user, synced across all peers
- Edit & delete your own messages
- Message history sync — new joiners receive the full chat log
- System messages — join/leave notifications

### Voice Chat
- **Push-to-talk** — hold the 🎤 button or spacebar to transmit
- Audio visualizer — 8-bar frequency display while transmitting
- Speaker indicators — see who's currently talking
- Works in both P2P and relay modes
- Opus compression at 16kbps — low bandwidth, clear voice

### Networking
- **Dual transport** — WebRTC direct + MQTT WebSocket relay
- **Automatic failover** — detects ICE failure, switches to relay in ~15 seconds
- **Connection diagnostics** — 🔧 panel shows every step of the connection process
- **Mode indicator** — header badge shows ⚡ P2P (green) or 📡 RELAY (amber)
- Mesh networking — peers automatically discover and connect to each other

### UI
- Dark cyberpunk aesthetic with neon accents
- Responsive layout — mobile sidebar, collapsible members panel
- Room code sharing — click to copy with toast confirmation
- Keyboard shortcuts — `Ctrl+M` toggles members, `Space` for push-to-talk

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

## Architecture

```
                    ┌─────────────────────────┐
                    │   PeerJS Signaling       │
                    │   (WebRTC handshake)     │
                    └────────┬────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  WebRTC Direct  ┌──────────┐
        │ Browser A │◄─────────────►│ Browser B │
        └──────────┘  (P2P mode)    └──────────┘
              │                            │
              │   ┌─────────────────┐      │
              └──►│  HiveMQ Broker  │◄─────┘
                  │  (MQTT relay)   │
                  └─────────────────┘
                    (Relay mode)
```

### Dual Transport

| Mode | Transport | Latency | When |
|------|-----------|---------|------|
| ⚡ P2P | WebRTC DataChannel | ~20-50ms | Both peers reachable (same network, open NAT) |
| 📡 Relay | MQTT over WebSocket | ~100-300ms | VPNs, symmetric NAT, strict firewalls |

On room create/join, both transports start simultaneously:

1. **PeerJS** connects to the signaling server and attempts WebRTC
2. **MQTT** connects to `wss://broker.hivemq.com:8884/mqtt` and subscribes to the room topic
3. If WebRTC ICE succeeds → **P2P mode** (green badge)
4. If ICE fails after 15 seconds → **Relay mode** (amber badge)

In relay mode, all messages are published/subscribed on MQTT topics `nexus/{roomCode}/msg` (text) and `nexus/{roomCode}/voice` (audio). Messages include a `_sender` field to filter out self-echoes.

### Voice Transport

| Mode | Path | Chunk Size |
|------|------|-----------|
| P2P | Mic → MediaRecorder → base64 → WebRTC DataChannel → Audio playback | ~400 bytes/200ms |
| Relay | Mic → MediaRecorder → base64 → MQTT voice topic → Audio playback | ~400 bytes/200ms |

Voice uses `MediaRecorder` with Opus/WebM codec at 16kbps. Audio is captured in 200ms chunks, base64-encoded, and sent as JSON packets. The receiver decodes and plays each chunk via the `Audio` API.

### ICE Configuration

STUN servers (discover public IP):
- `stun.l.google.com:19302`
- `stun1.l.google.com:19302`
- `stun.cloudflare.com:3478`
- `freestun.net:3478`

TURN servers (relay when direct fails):
- `freestun.net:3478` (UDP)
- `freestun.net:5349` (TCP/TLS)
- Cloudflare speed test TURN (dynamically fetched at page load)

### Message Protocol

| Type | Transport | Description |
|------|-----------|-------------|
| `hello` | Both | Exchange user info on connection |
| `sync` | Both | Send full message history to new peer |
| `message` | Both | New chat message |
| `typing` | Both | Typing indicator (3s timeout) |
| `reaction` | Both | Toggle emoji reaction |
| `edit` | Both | Edit own message content |
| `delete` | Both | Delete own message |
| `peers` | WebRTC | Share known peer IDs for mesh expansion |
| `voice` | Both | Audio chunk (base64 Opus/WebM) |
| `leave` | MQTT | Notify room of departure |

## Connection Diagnostics

Click the 🔧 button in the chat header to open the diagnostics panel. It shows a real-time log of every connection step:

- 🟢 **Green (✓)** — Step succeeded
- 🔴 **Red (✗)** — Step failed
- ⚪ **Gray (•)** — In progress

Key diagnostics:
- Cloudflare TURN credential fetch
- PeerJS signaling server connection
- ICE candidate gathering (host, srflx, relay types)
- ICE connection state transitions
- MQTT broker connection and subscription
- DataChannel open/close events
- Mode switches (P2P ↔ Relay)

## Limitations

- **No persistence** — messages exist only in connected browsers' memory
- **Voice latency in relay mode** — ~200-500ms due to encoding + MQTT round-trip
- **MQTT broker** — uses HiveMQ's free public broker; not guaranteed for production
- **Scale** — mesh works well for 2–8 peers; voice relay bandwidth scales linearly
- **No end-to-end encryption in relay mode** — messages are encrypted in transit (WSS/TLS) but the MQTT broker can theoretically read them. WebRTC P2P mode uses built-in DTLS encryption.

## External Dependencies

| Resource | Purpose |
|----------|---------|
| [PeerJS 1.5.4](https://peerjs.com/) | WebRTC signaling and data channels |
| [MQTT.js 5.10.3](https://github.com/mqttjs/MQTT.js) | MQTT WebSocket client for relay mode |
| [Google Fonts](https://fonts.google.com/) | Outfit + JetBrains Mono typefaces |
| [PeerJS Cloud](https://0.peerjs.com/) | Free signaling server (handshake only) |
| [HiveMQ Public Broker](https://www.hivemq.com/mqtt/public-mqtt-broker/) | Free MQTT relay (fallback transport) |

## License

MIT
