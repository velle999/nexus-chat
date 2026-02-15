# ⚡ NEXUS P2P

**End-to-end encrypted peer-to-peer chat with voice, file sharing, and GIFs — in a single HTML file.**

Nexus P2P is a fully encrypted, decentralized chat app with push-to-talk voice, file sharing, and a built-in GIPHY-powered GIF picker. It uses WebRTC for direct connections when possible, and automatically falls back to a WebSocket relay through VPNs and firewalls. All data is encrypted with AES-256-GCM before it leaves your browser. No accounts, no databases, no servers to deploy.

---

## How It Works

1. **Create a room** — Enter your name, pick a color, click "Create Room"
2. **Share the 6-character code** — This code is also the encryption key
3. **Others join** — They enter the code and derive the same encryption key
4. **Chat, talk, share files, send GIFs** — Everything is end-to-end encrypted

Both transports start in parallel. If direct P2P succeeds, you get the fastest path. If it fails (VPNs, symmetric NAT, corporate firewalls), the MQTT relay kicks in transparently. Either way, the relay never sees plaintext.

## Features

### End-to-End Encryption
- **AES-256-GCM** encryption for all data — messages, files, voice, reactions, typing indicators
- Room code → **PBKDF2** (100,000 iterations, SHA-256) → AES-256 key
- Random 12-byte IV per message — no IV reuse
- Relay server and signaling server see only encrypted blobs
- 🔒 E2E indicator in chat header confirms encryption is active

### Text Chat
- Real-time messaging with typing indicators
- Emoji reactions — toggle per-user, synced across all peers
- Edit & delete your own messages
- Message history sync — new joiners receive encrypted chat log
- URLs auto-link; image/GIF URLs auto-embed inline
- **Notification sound** — two-tone WebAudio chime on incoming messages

### GIF Picker
- **GIPHY-powered** — click the GIF button to open the picker
- Browse **trending GIFs** or search by keyword
- Debounced search (400ms) for responsive results
- Click a GIF to send — renders inline as an animated image
- "Powered by GIPHY" attribution included

### Voice Chat
- **Push-to-talk** — hold the 🎤 button or spacebar to transmit
- Walkie-talkie style — records full clip on hold, sends encrypted on release
- Audio visualizer — 8-bar frequency display while transmitting
- Speaker indicators — see who's currently talking
- Works in both P2P and relay modes
- Opus compression at 24kbps — encrypted before transmission
- Mobile: inline PTT bar above the message input

### File Sharing
- **Three ways to share**: 📎 attach button, drag & drop, or paste from clipboard
- **GIF files** — dedicated GIF button or upload directly; renders animated inline
- Image files render with preview thumbnails
- Color-coded file type icons (🎞️ GIFs, 🖼️ images, 🎬 video, 🎵 audio, 📄 docs, 📦 archives, 💻 code)
- Click any file card to download
- Size limits: **25MB** in P2P mode, **500KB** in relay mode
- Files are encrypted before transmission

### Networking
- **Dual transport** — WebRTC direct + MQTT WebSocket relay
- **Automatic failover** — detects ICE failure, switches to relay in ~15 seconds
- **Connection diagnostics** — 🔧 panel shows every step of the connection process
- **Mode indicator** — header badge shows ⚡ P2P (green) or 📡 RELAY (amber)
- Mesh networking — peers automatically discover and connect to each other

### UI
- Dark cyberpunk aesthetic with neon accents
- Responsive layout — mobile sidebar with inline voice controls
- Room code sharing — click to copy with toast confirmation
- Keyboard shortcuts — `Ctrl+M` toggles members, `Space` for push-to-talk

## Quick Start

No build step. No install. Just open the file.

```
Open nexus-p2p.html in any modern browser
```

To test locally, open it in two tabs — create a room in one, join with the code in the other.

### GIPHY Setup

The GIF picker requires a GIPHY API key. To use your own:

1. Create an account at [developers.giphy.com](https://developers.giphy.com)
2. Create an app to get a beta API key
3. Replace the `GIPHY_KEY` constant in the code with your key

### Hosting

Host the file anywhere static:

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
        ┌──────────┐  Encrypted P2P  ┌──────────┐
        │ Browser A │◄─────────────►│ Browser B │
        └──────────┘                └──────────┘
              │                            │
              │   ┌─────────────────┐      │
              └──►│  HiveMQ Broker  │◄─────┘
                  │  (sees only     │
                  │   ciphertext)   │
                  └─────────────────┘

    Room Code ──► PBKDF2 (100k iter) ──► AES-256-GCM Key
    All data encrypted before leaving the browser
```

### Encryption Flow

```
Sender                          Receiver
──────                          ────────
Plaintext message               Encrypted envelope
       │                               ▲
       ▼                               │
JSON.stringify()                JSON.parse()
       │                               ▲
       ▼                               │
AES-256-GCM encrypt             AES-256-GCM decrypt
(random 12-byte IV)             (extract IV from envelope)
       │                               ▲
       ▼                               │
{_e:true, iv:"...", ct:"..."}   {_e:true, iv:"...", ct:"..."}
       │                               ▲
       └──► WebRTC / MQTT ────────────┘
```

### Dual Transport

| Mode | Transport | Latency | When |
|------|-----------|---------|------|
| ⚡ P2P | WebRTC DataChannel | ~20-50ms | Both peers reachable (same network, open NAT) |
| 📡 Relay | MQTT over WebSocket | ~100-300ms | VPNs, symmetric NAT, strict firewalls |

### Voice Transport

| Mode | Path |
|------|------|
| P2P | Mic → MediaRecorder → Opus/WebM → AES-256-GCM → WebRTC → decrypt → playback |
| Relay | Mic → MediaRecorder → Opus/WebM → AES-256-GCM → MQTT → decrypt → playback |

### File Transport

| Mode | Max Size | Path |
|------|----------|------|
| P2P | 25MB | File → base64 → AES-256-GCM → WebRTC DataChannel |
| Relay | 500KB | File → base64 → AES-256-GCM → MQTT publish |

### Message Protocol

All message types are encrypted with AES-256-GCM before transmission.

| Type | Transport | Description |
|------|-----------|-------------|
| `hello` | Both | Exchange user info on connection |
| `sync` | Both | Send encrypted message history to new peer |
| `message` | Both | Chat message (text, file, or GIF URL) |
| `typing` | Both | Typing indicator (3s timeout) |
| `reaction` | Both | Toggle emoji reaction |
| `edit` | Both | Edit own message content |
| `delete` | Both | Delete own message |
| `peers` | WebRTC | Share known peer IDs for mesh expansion |
| `voice` | Both | Encrypted audio clip (Opus/WebM) |
| `leave` | MQTT | Notify room of departure |

## Security Model

**What's protected:**
- All message content, file data, voice audio, GIF URLs, metadata (reactions, typing, edits)
- Encrypted on both WebRTC (P2P) and MQTT (relay) paths

**What's NOT protected:**
- Room code transmission — share it out-of-band
- Connection metadata — the MQTT broker knows which topics are active
- GIF search queries — sent to GIPHY's API over HTTPS (not through the encrypted channel)

**Trust model:**
- The room code IS the shared secret — anyone with it can decrypt
- Keys are ephemeral — derived in-memory, never persisted to disk

## Limitations

- **No persistence** — messages exist only in connected browsers' memory
- **Voice latency** — walkie-talkie style (full clip sent on release, not streaming)
- **MQTT broker** — uses HiveMQ's free public broker; not guaranteed for production
- **Scale** — mesh works well for 2–8 peers
- **File size in relay** — 500KB limit due to MQTT message size constraints
- **GIPHY rate limit** — beta keys allow 100 API calls/hour

## External Dependencies

| Resource | Purpose |
|----------|---------|
| [PeerJS 1.5.4](https://peerjs.com/) | WebRTC signaling and data channels |
| [MQTT.js 5.10.3](https://github.com/mqttjs/MQTT.js) | MQTT WebSocket client for relay mode |
| [GIPHY API v1](https://developers.giphy.com/) | GIF search and trending |
| [Google Fonts](https://fonts.google.com/) | Outfit + JetBrains Mono typefaces |
| [PeerJS Cloud](https://0.peerjs.com/) | Free signaling server (handshake only) |
| [HiveMQ Public Broker](https://www.hivemq.com/mqtt/public-mqtt-broker/) | Free MQTT relay (sees only ciphertext) |
| [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | AES-256-GCM + PBKDF2 (built into browsers) |

## License

MIT
