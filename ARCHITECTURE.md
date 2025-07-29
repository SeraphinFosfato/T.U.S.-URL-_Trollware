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

### **Flusso Utente**
```
1. /:shortId → redirect a /v/:shortId (step 0)
2. /v/:shortId/:step → carica blocco da sequence
3. Blocco completato → /v/:shortId/:step+1
4. Tutti blocchi completati → redirect URL originale
```

## Database Schema (In-Memory)

```javascript
// Map: urls (shortId -> urlData)
{
  "abc123": {
    original_url: "https://example.com",
    blocks_sequence: ["timer_5s", "timer_punish_15s"],
    created_at: Date,
    stats: { visits: 0, completed: 0 }
  }
}

// Map: sessions (fingerprint -> sessionData) - Futuro
{
  "user_hash": {
    current_url_id: "abc123",
    current_step: 1,
    penalties: [],
    last_activity: Date
  }
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