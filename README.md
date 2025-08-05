# 🧌 TrollShortener - URL Shortener Jokeware

> Un URL shortener che forza gli utenti attraverso step fastidiosi prima del redirect finale

## 🚀 Stato Progetto (Iterazione 21 - Stabile)

### ✅ Funzionalità Core Implementate
- **MVP Funzionante** con RNG deterministico stabile
- **Timer Standard** (pause/resume con penalty 1.5s + 2-5s random)
- **Timer Punitivo** (Windows 95 style, reload su focus loss)
- **Click Game** con progress bar visiva e feedback migliorato
- **Sistema Sessioni** robusto con fallback DB
- **Template System** avanzato con vincoli temporali ottimizzato

### 🏗️ Architettura
- **Backend**: Node.js/Express + MongoDB Atlas
- **Frontend**: Minimal templates ottimizzati per bandwidth
- **Deploy**: Render.com con auto-deploy da GitHub
- **Database**: MongoDB Atlas con TTL automatico

### 🎯 Ultimi Fix Critici (Iterazione 21)
1. **RNG Deterministico**: Risolto problema reload cambia percorso
2. **Continue Button**: Verificato funzionamento ultimo step
3. **Percorsi Personalizzati**: Fingerprint diversi = sequenze uniche
4. **UI Ottimizzata**: Progress bar, transizioni fluide, feedback visivo

## 🧪 Test e Verifica

### Link di Test Attivo
- **URL**: https://tus-tasklink.onrender.com
- **Test Reload**: `node test-reload-consistency.js`
- **Test Final Step**: `node create-test-link.js`

### Comportamenti Verificati
- ✅ Stesso fingerprint = stessa sequenza sempre
- ✅ Fingerprint diversi = sequenze uniche
- ✅ Reload non cambia percorso
- ✅ Continue button funziona correttamente
- ✅ Redirect finale a URL originale

## 📁 Struttura File Critici

```
backend/
├── routes/victim.js           # 🔥 CORE - Gestione step utente
├── utils/advanced-template-system.js  # 🔥 CORE - RNG deterministico
├── utils/client-fingerprint.js        # 🔥 CORE - Sessioni utente
├── templates/minimal-templates.js      # 🎨 UI - Template ottimizzati
└── config/database.js         # 💾 DB - Wrapper MongoDB
```

## ⚠️ Punti Critici - NON MODIFICARE

### 🔒 RNG Deterministico (advanced-template-system.js)
```javascript
// ❌ NON AGGIUNGERE Date.now() o Math.random() al seed!
generateImprovedSeed(fingerprint, shortId) {
  const components = [
    fingerprint,
    shortId,
    'troll_rng_salt_2024' // Salt fisso per sicurezza
  ];
  // Seed DEVE essere deterministico per stesso fingerprint+shortId
}
```

### 🔒 Logica Step (victim.js)
```javascript
// ❌ NON MODIFICARE questa logica!
if (currentStep >= pathData.templates.length) {
  // Redirect finale - CRITICO per funzionamento
  return res.redirect(urlData.original_url);
}
```

### 🔒 Sistema Sessioni (client-fingerprint.js)
```javascript
// ❌ NON MODIFICARE il sistema di fallback DB!
// Cookie + localStorage + DB fallback = robustezza
```

## 🎮 Template Disponibili

### Timer
- `timer_simple`: 15-60s, pause/resume con penalty
- `timer_punish`: 20-45s, Windows 95 style, reload su focus loss

### Click Games
- `click_simple`: 3-60 click, delay 0.5s
- `click_drain`: 10-60 click, più lento (0.67s per click)

### Compositi
- `timer_then_click`: Timer seguito da click game
- `click_then_timer`: Click game seguito da timer
- `double_timer`: Due timer in sequenza

## 🚀 Deploy

```bash
# Auto-deploy su ogni push
git add -A
git commit -m "🔧 Descrizione modifiche"
git push origin main
# Render.com fa deploy automatico
```

## 📊 Prossimi Sviluppi

### In Sviluppo (Iterazione 22)
- **Teleporting Click Game**: Click button che si sposta
- **Racing Click Game**: Riempi barra vs svuotamento
- **Rigged Racing**: Racing truccato con timer invisibile

### Roadmap Futura
- Analytics Dashboard
- Custom Themes
- API Rate Limiting
- Banner Pubblicitari non invasivi

---

**🎯 Progetto Stabile e Pronto per Produzione**

*Deploy Live*: https://tus-tasklink.onrender.com