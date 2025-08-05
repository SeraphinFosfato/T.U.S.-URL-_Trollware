# TrollShortener - Architettura Sistema Intelligente

## Struttura Progetto (Iterazione 23)

```
troll-url-shortener/
├── backend/
│   ├── server.js                    # Server Express principale
│   ├── config/
│   │   ├── database.js              # Wrapper MongoDB Atlas
│   │   ├── mongodb.js               # Driver MongoDB
│   │   └── free-tier-manager.js     # Gestione limiti risorse
│   ├── routes/
│   │   ├── shortener.js             # API creazione link
│   │   ├── victim.js                # 🔥 CORE - Gestione step utente
│   │   ├── admin.js                 # Dashboard amministrativa
│   │   └── debug.js                 # Endpoint debug
│   ├── utils/
│   │   ├── advanced-template-system.js      # 🔥 CORE - Sistema template
│   │   ├── template-time-estimator.js       # 🧠 NEW - Stime temporali
│   │   ├── smart-template-distributor.js    # 🧠 NEW - Algoritmo intelligente
│   │   ├── client-fingerprint.js           # 🔥 CORE - Sessioni stabili
│   │   ├── debug-logger.js                 # Sistema logging
│   │   └── shortener.js                    # Utilità base
│   ├── templates/
│   │   └── minimal-templates.js     # 🎨 UI - Template ottimizzati
│   └── package.json
├── tests/                           # 🧪 Suite test completa
│   ├── test-racing.js              # Test racing games
│   ├── test-rigged.js              # Test rigged racing
│   ├── test-teleport.js            # Test teleporting click
│   ├── test-all-games.js           # Test multi-game
│   └── create-test-link.js         # Test generico
├── frontend/
│   └── index.html                  # Landing page
└── README.md                       # Documentazione completa
```

## Architettura Sistema Intelligente

### **🧠 Template Time Estimator**
```javascript
// Stime temporali standardizzate per ogni template
{
  timer_simple: {
    type: 'direct',
    baseTime: (duration) => duration,
    variance: 0.1,
    frustrationFactor: 1.0
  },
  click_racing_rigged: {
    type: 'dynamic', 
    baseTime: (params) => {
      // Formula: medium_racing_time + fake_time/10
      const baseDuration = params.realDuration || 20;
      const mediumRacingTime = baseDuration * 1.0;
      const fakeTimeBonus = baseDuration / 10;
      return mediumRacingTime + fakeTimeBonus;
    }
  }
}
```

### **🎯 Smart Template Distributor**
```javascript
// Algoritmo intelligente per selezione template
class SmartTemplateDistributor {
  // Limiti massimi realistici per template singoli
  templateLimits = {
    timer_simple: 60,      // Max 60s
    click_simple: 20,      // 40 click * 0.5s
    click_racing: 120,     // Può durare di più
    // Compositi: nessun limite rigido
  }
  
  // Logica intelligente:
  // 1. Bonus compositi per tempi >90s
  // 2. Penalty singoli oltre 80% del limite
  // 3. Precisione temporale
  // 4. Varietà garantita
}
```

### **🔄 Flusso Utente Ottimizzato**
```
1. /:shortId → redirect a /v/:shortId (step 0)
2. Sistema intelligente genera sequenza ottimale
3. Template compositi per tempi lunghi automaticamente
4. Sessioni stabili con fingerprint deterministico
5. Redirect finale all'URL originale

🔥 OTTIMIZZAZIONI ITERAZIONE 23:
- Selezione template completamente automatizzata
- Calcoli temporali accurati al 90%+
- Template compositi per step >90s
- Varietà garantita senza ripetizioni eccessive
- Sessioni stabili per tutta la durata URL
```

## Database Schema (MongoDB Atlas)

```javascript
// Collection: urls
{
  "shortId": "abc123",
  "original_url": "https://example.com", 
  "user_params": {
    "timePreset": "2min",
    "steps": null,           // null = auto
    "expiryPreset": "1d",
    "testTemplate": null     // Per test deterministici
  },
  "expiry_days": 1,
  "created_at": Date,
  "expires_at": Date,        // TTL automatico
  "stats": { "visits": 0, "completed": 0 }
}

// Collection: sessions (client paths)
{
  "pathHash": "a1b2c3d4e5f6",
  "shortId": "abc123", 
  "fingerprint": "fp_1a2b3c4d",
  "currentStep": 1,
  "templates": [             // Generati da sistema intelligente
    {
      "type": "composite",
      "subtype": "timer_then_click",
      "sequence": [...],
      "estimatedTime": 120
    }
  ],
  "metadata": {
    "algorithm": "intelligent",
    "accuracy": 0.05,        // Precisione temporale
    "seed": "abc12345"
  },
  "completed": false,
  "created_at": Date,
  "expires_at": Date         // TTL = TTL URL
}
```

## Template Disponibili (9 Totali)

### **⏱️ Timer (2)**
- `timer_simple`: 15-60s, pause/resume con penalty
- `timer_punish`: 20-45s, Windows 95 style, reload su focus loss

### **🖱️ Click Games (4)**  
- `click_simple`: 3-40 click, delay random 0.4-0.6s
- `click_drain`: 10-40 click, più lento (0.67s per click)
- `click_teleport`: 5-40 click, button che si teletrasporta
- `click_racing`: 15-120s, riempi barra vs drain passivo
- `click_racing_rigged`: 10-150s, racing truccato con accelerazione dinamica

### **🔄 Compositi (3)**
- `timer_then_click`: Timer seguito da click game
- `click_then_timer`: Click game seguito da timer
- `double_timer`: Due timer in sequenza (normale + punitivo)

## Sistema Intelligente - Logica Selezione

### **Viabilità Template**
```javascript
// Template è viable se può raggiungere il tempo target ±50%
isTemplateViable(templateId, targetTime, params) {
  const range = getTimeRange(templateId, params);
  const tolerance = 0.5;
  return range.expected >= targetTime * (1-tolerance) && 
         range.expected <= targetTime * (1+tolerance);
}
```

### **Peso Dinamico**
```javascript
// Calcolo peso finale per selezione
finalWeight = baseWeight * 
              (1 + precisionBonus) *     // Vicinanza tempo target
              varietyPenalty *           // Penalty ripetizioni
              compositeBonusOrPenalty;   // Bonus compositi/penalty singoli
```

### **Preferenza Automatica Compositi**
- **Tempi >90s**: Bonus crescente fino a 2x
- **Singoli al limite**: Penalty fino a 70%
- **Risultato**: Selezione naturale ottimale

## Deploy e Monitoring

### **Deploy Automatico**
```bash
git push origin main → Render.com auto-deploy
```

### **Monitoring**
- **Live URL**: https://tus-tasklink.onrender.com
- **Admin**: /admin/usage (limiti risorse)
- **Debug**: /debug/status (stato sistema)

### **Metriche Sistema Intelligente**
- **Accuratezza temporale**: ~90%+ 
- **Varietà template**: Penalty ripetizioni automatica
- **Preferenza compositi**: Automatica per tempi lunghi
- **Stabilità sessioni**: TTL ottimizzato

---

**🎯 Architettura Stabile e Intelligente - Pronta per Produzione**

*Sistema completamente automatizzato per selezione template ottimale*