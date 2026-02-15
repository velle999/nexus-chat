# ⚡ NEXUS P2P

**End-to-end encrypted peer-to-peer chat with voice, file sharing, and GIFs — in a single HTML file.**


No install. No server. No accounts. Just open the html file to run portable.

---

## 🖥️ Desktop App (Optional Install)

Prefer a native app experience? You can install **Nexus P2P** on Windows:

**Download installer (.msi):**  
https://github.com/velle999/nexus-chat/releases/download/installer/Nexus.Chat_0.1.0_x64_en-US.msi

### Install Steps

1. Download the `.msi` file from the link above  
2. Double-click to launch the installer  
3. Follow the setup wizard  
4. Launch **Nexus Chat** from your Start Menu  

That’s it — same secure P2P system, just wrapped in a desktop shell.

> The desktop version still runs fully client-side. No accounts, no servers, no tracking.

---

## Features

- **E2E Encrypted** — AES-256-GCM, room code as key via PBKDF2  
- **One-click room links** — shareable URL with room code, encryption salt, and nickname  
- **QR code invite** — scan to join from another device instantly  
- **Persistent rooms** — check 💾 and rooms last 10 days while active  
- **Panic mode** — one button wipes all keys, messages, connections, and data  
- **Push-to-talk voice** — Opus/WebM, encrypted before sending  
- **File sharing** — drag & drop, paste, up to 25MB (P2P) / 500KB (relay)  
- **GIF picker** — GIPHY-powered search and trending  
- **Notification sounds** — WebAudio chime on incoming messages  
- **Dual transport** — WebRTC direct + MQTT relay fallback  
- **Mobile friendly** — responsive layout with inline voice controls  

---

## Sharing Rooms

### Invite Link
Click **🔗 Link** in the sidebar to generate a shareable URL. The link encodes the room code and encryption salt in the URL hash fragment. When someone opens the link, the room code auto-fills on the connect screen — they just enter a name and click Join.

Link format: nexus-chat.html#room=ABC123&s=nexus-p2p-e2e-v1&p=1


### QR Code
Click **📱 QR** to show a scannable QR code. Another device on any network can scan it to get the invite link. The QR renders in cyberpunk colors (cyan on dark) and encodes the same invite URL.

---

## 🚨 Panic Mode

The **🚨 PANIC** button in the sidebar (or `Ctrl+Shift+X`) immediately:

1. Destroys all encryption keys  
2. Disconnects all WebRTC peers  
3. Disconnects MQTT relay  
4. Stops microphone  
5. Overwrites message content in memory  
6. Wipes all messages and state  
7. Deletes IndexedDB (all persistent rooms)  
8. Clears localStorage  
9. Clears URL hash  
10. Nukes the DOM and shows restart screen  

This cannot be undone. For when you need everything gone *now*.

---

## 💾 Persistent Rooms

Check **💾 Persistent room** when creating or joining. Chat history saves to IndexedDB. Rejoin later with the same room code to reload your messages.

Rooms stay active for **10 days** from the last message. Every message resets the timer. Inactive rooms auto-clean.

---

## 🔐 Security

- AES-256-GCM encryption on all data before leaving the browser  
- Room code → PBKDF2 (100k iterations) → AES key  
- Random 12-byte IV per message  
- Invite links encode only the room code and salt in the URL hash (fragment — never sent to servers)  
- Panic mode overwrites sensitive memory before clearing  
- MQTT relay sees only encrypted blobs  

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+X` | Panic wipe |
| `Space` (hold) | Push-to-talk |
| `Ctrl+M` | Toggle members panel |
| `Escape` | Close modals |

---

## License

MIT
