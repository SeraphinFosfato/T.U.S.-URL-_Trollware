# 🧌 TrollShortener - URL Shortener Jokeware

> Un URL shortener che forza gli utenti attraverso step fastidiosi prima del redirect finale

## 🚀 Stato Progetto (Iterazione 22 - Nuovi Games)

### ✅ Funzionalità Core Implementate
- **MVP Funzionante** con RNG deterministico stabile
- **Timer Standard** (pause/resume con penalty 1.5s + 2-5s random)
- **Timer Punitivo** (Windows 95 style, reload su focus loss)
- **Click Games Avanzati** con 6 varianti diverse
- **Sistema Sessioni** robusto con fallback DB
- **Template System** avanzato con 9 template totali

### 🏗️ Architettura
- **Backend**: Node.js/Express + MongoDB Atlas
- **Frontend**: Minimal templates ottimizzati per bandwidth
- **Deploy**: Render.com con auto-deploy da GitHub
- **Database**: MongoDB Atlas con TTL automatico

### 🎯 Nuove Features (Iterazione 22)
1. **Teleporting Click**: Button che si teletrasporta (35% hover, 10% barriera, 5s idle)
2. **Racing Click**: Riempi barra vs drain automatico (3 difficoltà)
3. **Rigged Racing**: Racing truccato con timer nascosto
4. **Template Avanzati**: 6 atomici + 3 compositi = 9 template totali

## 🧪 Test e Verifica

### Link di Test Attivo
- **URL**: https://tus-tasklink.onrender.com
- **Test Organizzati**: Cartella `tests/`

### Script di Test Disponibili
```bash
cd tests
node test-teleport.js      # Teleporting click game
node test-racing.js        # Racing click game  
node test-rigged.js        # Rigged racing game
node test-all-games.js     # Sequenza multi-game
node create-test-link.js   # Link generico
```

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

## 🎮 Template Disponibili (9 Totali)

### Timer (2)
- `timer_simple`: 15-60s, pause/resume con penalty
- `timer_punish`: 20-45s, Windows 95 style, reload su focus loss

### Click Games (6)
- `click_simple`: 3-60 click, delay 0.5s
- `click_drain`: 10-60 click, più lento (0.67s per click)
- `click_teleport`: 5-40 click, button che si teletrasporta
- `click_racing`: 15-45s, riempi barra vs drain
- `click_racing_rigged`: 10-40s, racing truccato con timer nascosto

### Compositi (3)
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

### Completato (Iterazione 22)
- **Teleporting Click Game**: ✅ Implementato con barriera predittiva
- **Racing Click Game**: ✅ Implementato con 3 difficoltà
- **Rigged Racing**: ✅ Implementato con timer nascosto

### In Sviluppo (Iterazione 23)
- **Sistema Layered**: Minigiochi sovrapposti nella stessa posizione
- **Template Ricombinati**: Nuove combinazioni con 9 template

### Roadmap Futura
- Analytics Dashboard
- Custom Themes
- API Rate Limiting
- Banner Pubblicitari non invasivi

---

**🎯 Progetto Stabile e Pronto per Produzione**

*Deploy Live*: https://tus-tasklink.onrender.com