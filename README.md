# ⚡ NEXUS P2P

**End-to-end encrypted peer-to-peer chat with voice, file sharing, and GIFs — in a single HTML file.**

```
Open nexus-p2p.html in any browser
```

No install. No server. No accounts.

---

## Features

- **E2E Encrypted** — AES-256-GCM, room code as key via PBKDF2
- **Persistent rooms** — check 💾 on the connect screen and your room stays alive for 10 days while active
- **Push-to-talk voice** — Opus/WebM, encrypted before sending
- **File sharing** — drag & drop, paste, up to 25MB (P2P) / 500KB (relay)
- **GIF picker** — GIPHY-powered search and trending
- **Notification sounds** — WebAudio chime on incoming messages
- **Dual transport** — WebRTC direct + MQTT relay fallback
- **Mobile friendly** — responsive layout with inline voice controls

## Persistent Rooms

Check **💾 Persistent room** when creating or joining. Chat history is saved in your browser's IndexedDB. Close the tab, come back later, rejoin with the same room code — your messages are still there.

Rooms stay active for **10 days** from the last message. Every message resets the timer. Stop using it for 10 days and it cleans up automatically.

Messages are stored as-is in IndexedDB — the same E2E encrypted data that goes over the wire. Persistence is per-browser (each participant saves their own copy).

## How It Works

1. **Create a room** — get a 6-character code
2. **Share the code** — this is also the encryption key
3. **Others join** — they derive the same AES-256 key from the code
4. **Chat** — messages go P2P via WebRTC, or fall back to MQTT relay through firewalls

## Security

- All data encrypted with AES-256-GCM before leaving the browser
- Room code → PBKDF2 (100k iterations) → AES key
- Random 12-byte IV per message
- MQTT relay sees only encrypted blobs
- Persistent messages stored encrypted in IndexedDB
- GIF searches go to GIPHY API separately

## License

MIT
