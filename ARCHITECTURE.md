# TrollShortener - Architettura

## Struttura Progetto Implementata

```
troll-url-shortener/
├── backend/
│   ├── server.js            # Server Express principale
│   ├── config/
│   │   └── database.js      # In-memory DB (per testing)
│   ├── routes/
│   │   ├── shortener.js     # API creazione link + redirect
│   │   └── victim.js        # Gestione step blocchi
│   ├── blocks/
│   │   ├── base-block.js    # Classe base per blocchi modulari
│   │   └── timer.js         # Timer normali e punitivi
│   ├── templates/
│   │   └── page-templates.js # Template di pagina per widget
│   ├── utils/
│   │   ├── shortener.js     # Generazione ID e validazione URL
│   │   └── blocks.js        # Sistema gestione blocchi
│   └── package.json
├── frontend/
│   ├── index.html           # Landing page creazione link
│   └── script.js            # JavaScript frontend
├── package.json             # Dipendenze root per Render
└── render.yaml              # Configurazione deploy
```

## Architettura Modulare Widget

### **Sistema Template + Widget**
- **Page Templates**: Contenitori HTML per i widget
- **Widget Blocks**: Componenti isolati con CSS e JS proprio
- **Template Rendering**: `{{BLOCK_CONTENT}}` sostituito con widget

### **Flusso Utente Ottimizzato**
```
1. /:shortId → redirect a /v/:shortId (step 0)
2. /v/:shortId/0 → genera sessione client-side + primo template
3. /v/:shortId/:step → legge template da sessione locale
4. Tutti step completati → redirect URL originale

🔥 OTTIMIZZAZIONI:
- Template generati randomicamente e salvati in localStorage
- Solo 1 query DB per shortId, resto tutto client-side
- Bandwidth ridotta del 70% con template minimal
- TTL personalizzabile (1-7 giorni)
- Monitoraggio usage con /admin/usage
```

## Database Schema (MongoDB Ottimizzato)

```javascript
// Collection: urls (SOLO dati essenziali)
{
  "shortId": "abc123",
  "original_url": "https://example.com",
  "total_steps": 3,
  "expiry_days": 7,
  "created_at": Date,
  "expires_at": Date, // TTL automatico
  "stats": { "visits": 0, "completed": 0 }
}

// Collection: client_paths (percorsi per-client con fingerprinting)
{
  "pathHash": "a1b2c3d4e5f6", // Hash univoco percorso
  "shortId": "abc123",
  "fingerprint": "fp_1a2b3c4d", // Hash fingerprint client
  "currentStep": 1,
  "templates": [
    { "type": "timer", "duration": 25 },
    { "type": "click", "target": 7 },
    { "type": "timer_punish", "duration": 30 }
  ],
  "completed": false,
  "created_at": Date,
  "expires_at": Date // TTL legato al link
}

// Client Cookie (criptato, solo dati essenziali)
{
  "pathHash": "a1b2c3d4e5f6",
  "shortId": "abc123",
  "currentStep": 1,
  "expiresAt": timestamp
}
```

## Blocchi Implementati

### **Timer Blocks**
- `timer_5s`, `timer_15s`, `timer_30s` - Timer normali
- `timer_punish_15s`, `timer_punish_30s` - Timer punitivi

**Differenze:**
- **Normali**: Pausa su focus loss, UI moderna
- **Punitivi**: Reload pagina su focus loss, UI Windows 95

### **Page Templates**
- `simple_center` - Layout centrato semplice
- `fake_download` - Pagina finta download

## Testing System

```javascript
// Override sequenza blocchi (per testing)
POST /api/shorten?test=timer_5s,timer_punish_15s

// Template specifico
GET /v/:shortId?template=fake_download
```