# ⚡ NEXUS P2P

**End-to-end encrypted peer-to-peer chat with voice and file sharing — in a single HTML file.**

Nexus P2P is a fully encrypted, decentralized chat app with push-to-talk voice and file sharing. It uses WebRTC for direct connections when possible, and automatically falls back to a WebSocket relay through VPNs and firewalls. All data is encrypted with AES-256-GCM before it leaves your browser — the relay server sees only ciphertext. No accounts, no databases, no servers to deploy.

---

## How It Works

1. **Create a room** — Enter your name, pick a color, click "Create Room"
2. **Share the 6-character code** — This code is also the encryption key
3. **Others join** — They enter the code and derive the same encryption key
4. **Chat, talk, share files** — Everything is end-to-end encrypted

Both transports start in parallel. If direct P2P succeeds, you get the fastest path. If it fails (VPNs, symmetric NAT, corporate firewalls), the MQTT relay kicks in transparently. Either way, the relay never sees plaintext.

## Features

### End-to-End Encryption
- **AES-256-GCM** encryption for all data — messages, files, voice, reactions, typing indicators
- Room code → **PBKDF2** (100,000 iterations, SHA-256) → AES-256 key
- Random 12-byte IV per message — no IV reuse
- Relay server and signaling server see only encrypted blobs
- 🔒 E2E indicator in chat header confirms encryption is active
- Zero-knowledge architecture — no keys stored anywhere except in-browser memory

### Text Chat
- Real-time messaging with typing indicators
- Emoji reactions — toggle per-user, synced across all peers
- Edit & delete your own messages
- Message history sync — new joiners receive encrypted chat log
- System messages — join/leave notifications

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
- Image files render inline with preview thumbnails
- Color-coded file type icons (🖼️ images, 🎬 video, 🎵 audio, 📄 docs, 📦 archives, 💻 code)
- Click any file card to download
- Size limits: **25MB** in P2P mode, **500KB** in relay mode
- Files are encrypted before transmission — relay sees only ciphertext

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
            (encrypted in transit)
```

All peers derive the same AES key from the room code via PBKDF2. The key never leaves the browser. The room code is the shared secret — anyone with the code can decrypt, which is the correct trust model.

### Dual Transport

| Mode | Transport | Latency | When |
|------|-----------|---------|------|
| ⚡ P2P | WebRTC DataChannel | ~20-50ms | Both peers reachable (same network, open NAT) |
| 📡 Relay | MQTT over WebSocket | ~100-300ms | VPNs, symmetric NAT, strict firewalls |

On room create/join, both transports start simultaneously:

1. AES-256 key derived from room code via PBKDF2
2. **PeerJS** connects to the signaling server and attempts WebRTC
3. **MQTT** connects to `wss://broker.hivemq.com:8884/mqtt` and subscribes to the room topic
4. If WebRTC ICE succeeds → **P2P mode** (green badge)
5. If ICE fails after 15 seconds → **Relay mode** (amber badge)

In relay mode, all messages are published/subscribed on MQTT topics `nexus/{roomCode}/msg` (text) and `nexus/{roomCode}/voice` (audio). The broker only ever receives encrypted envelopes.

### Voice Transport

| Mode | Path |
|------|------|
| P2P | Mic → MediaRecorder → Opus/WebM blob → AES-256-GCM encrypt → base64 → WebRTC → decrypt → Audio playback |
| Relay | Mic → MediaRecorder → Opus/WebM blob → AES-256-GCM encrypt → base64 → MQTT → decrypt → Audio playback |

Voice uses `MediaRecorder` with Opus/WebM codec at 24kbps. The complete PTT clip is recorded, encrypted, base64-encoded, and sent as a single packet on button release. Max clip size: ~500KB (~15-20 seconds).

### File Transport

| Mode | Max Size | Path |
|------|----------|------|
| P2P | 25MB | File → base64 → AES-256-GCM encrypt → WebRTC DataChannel |
| Relay | 500KB | File → base64 → AES-256-GCM encrypt → MQTT publish |

Files use chunked base64 encoding (8KB chunks to avoid stack overflow). Image files include inline preview. File metadata is preserved in sync but binary data is stripped to keep history transfers lightweight.

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

All message types are encrypted with AES-256-GCM before transmission.

| Type | Transport | Description |
|------|-----------|-------------|
| `hello` | Both | Exchange user info on connection |
| `sync` | Both | Send encrypted message history to new peer |
| `message` | Both | Chat message (text and/or file attachment) |
| `typing` | Both | Typing indicator (3s timeout) |
| `reaction` | Both | Toggle emoji reaction |
| `edit` | Both | Edit own message content |
| `delete` | Both | Delete own message |
| `peers` | WebRTC | Share known peer IDs for mesh expansion |
| `voice` | Both | Encrypted audio clip (Opus/WebM) |
| `leave` | MQTT | Notify room of departure |

## Connection Diagnostics

Click the 🔧 button in the chat header to open the diagnostics panel:

- 🟢 **Green (✓)** — Step succeeded (includes "E2E: room key derived ✓")
- 🔴 **Red (✗)** — Step failed
- ⚪ **Gray (•)** — In progress

Key diagnostics: Cloudflare TURN fetch, PeerJS signaling, ICE candidates, MQTT connection, E2E key derivation, DataChannel events, mode switches.

## Security Model

**What's protected:**
- All message content, file data, voice audio, metadata (reactions, typing, edits)
- Encrypted on both WebRTC (P2P) and MQTT (relay) paths
- The MQTT broker, PeerJS signaling server, and any network intermediary sees only `{_e:true, iv:"...", ct:"..."}` envelopes

**What's NOT protected:**
- Room code transmission — you share it out-of-band (text, in person, etc.)
- Connection metadata — the MQTT broker knows which topics are active (room codes), and PeerJS knows peer IDs
- Timing — the broker can observe when messages are sent and their approximate size

**Trust model:**
- The room code IS the shared secret. Anyone with the code can derive the key and decrypt.
- Keys are ephemeral — derived in-memory from the room code, never persisted to disk
- No key escrow, no recovery — close all tabs and the key is gone

## Limitations

- **No persistence** — messages exist only in connected browsers' memory
- **Voice latency** — walkie-talkie style (full clip sent on release, not streaming)
- **MQTT broker** — uses HiveMQ's free public broker; not guaranteed for production
- **Scale** — mesh works well for 2–8 peers; voice/file bandwidth scales linearly
- **File size in relay** — 500KB limit due to MQTT message size constraints
- **Room code entropy** — 6 characters from a 32-char alphabet = ~2.4 billion possible codes. Sufficient for casual use, not for nation-state adversaries.

## External Dependencies

| Resource | Purpose |
|----------|---------|
| [PeerJS 1.5.4](https://peerjs.com/) | WebRTC signaling and data channels |
| [MQTT.js 5.10.3](https://github.com/mqttjs/MQTT.js) | MQTT WebSocket client for relay mode |
| [Google Fonts](https://fonts.google.com/) | Outfit + JetBrains Mono typefaces |
| [PeerJS Cloud](https://0.peerjs.com/) | Free signaling server (handshake only) |
| [HiveMQ Public Broker](https://www.hivemq.com/mqtt/public-mqtt-broker/) | Free MQTT relay (sees only ciphertext) |
| [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | AES-256-GCM + PBKDF2 (built into all modern browsers) |

## License

MIT
