# TrollShortener - Architettura

## Struttura Progetto Ottimizzata

```
TrollShortener/
├── server.js                 # Server principale
├── config/
│   ├── database.js          # Connessione DB esterno
│   └── blocks-config.js     # Configurazione blocchi
├── routes/
│   ├── shortener.js         # API per creare/gestire link
│   ├── victim.js            # Gestione step vittime
│   └── admin.js             # Dashboard creazione (futuro)
├── blocks/
│   ├── templates/           # Template base per categorie
│   ├── timer/              # Blocchi timer
│   ├── minigame/           # Mini giochi
│   ├── deceiver/           # Fake buttons/banners
│   ├── traps/              # Fullscreen/audio traps
│   └── misc/               # Decorazioni/media
├── utils/
│   ├── fingerprint.js      # User identification
│   ├── crypto.js           # Cookie encryption
│   ├── anti-cheat.js       # Validation systems
│   └── detection.js        # AdBlock/popup detection
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
└── views/
    ├── landing.html        # Pagina creazione link
    ├── victim.html         # Template per vittime
    └── block-templates/    # HTML templates blocchi
```

## Database Schema (MongoDB)

```javascript
// Collection: shortened_urls
{
  _id: "abc123",
  original_url: "https://example.com",
  blocks_sequence: ["timer_10s", "minigame_click", "deceiver_fake404"],
  created_at: Date,
  stats: { visits: 0, completed: 0 }
}

// Collection: user_sessions
{
  fingerprint: "hash_unique",
  current_url_id: "abc123",
  current_step: 1,
  penalties: [],
  timers: { "timer_10s": timestamp },
  last_activity: Date
}
```