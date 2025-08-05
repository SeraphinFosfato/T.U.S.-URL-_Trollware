# 🧌 TrollShortener - URL Shortener Jokeware

> Un URL shortener che forza gli utenti attraverso step fastidiosi prima del redirect finale

## 🚀 Stato Progetto (Iterazione 23 - Sistema Intelligente Completo)

### ✅ Funzionalità Core Implementate
- **Sistema Intelligente** con distribuzione template ottimizzata
- **9 Template Totali**: 6 atomici + 3 compositi
- **Racing Games Perfezionati** con meccanismi frustranti
- **Sessioni Stabili** con fingerprint deterministico
- **Template Time Estimator** standardizzato e scalabile

### 🏗️ Architettura
- **Backend**: Node.js/Express + MongoDB Atlas
- **Frontend**: Minimal templates ottimizzati per bandwidth
- **Deploy**: Render.com con auto-deploy da GitHub
- **Database**: MongoDB Atlas con TTL automatico

### 🧠 Sistema Intelligente (Nuovo)
1. **Template Time Estimator**: Stime temporali standardizzate per ogni template
2. **Smart Template Distributor**: Algoritmo intelligente per selezione ottimale
3. **Template Limits Logic**: Preferenza automatica per compositi su tempi lunghi
4. **Bilanciamento Dinamico**: Varietà garantita e precisione temporale

## 🎮 Template Disponibili (9 Totali)

### ⏱️ Timer (2)
- `timer_simple`: 15-60s, pause/resume con penalty
- `timer_punish`: 20-45s, Windows 95 style, reload su focus loss

### 🖱️ Click Games (4)
- `click_simple`: 3-40 click, delay random 0.4-0.6s
- `click_drain`: 10-40 click, più lento (0.67s per click)
- `click_teleport`: 5-40 click, button che si teletrasporta
- `click_racing`: 15-120s, riempi barra vs drain passivo
- `click_racing_rigged`: 10-150s, racing truccato con accelerazione dinamica

### 🔄 Compositi (3)
- `timer_then_click`: Timer seguito da click game
- `click_then_timer`: Click game seguito da timer
- `double_timer`: Due timer in sequenza (normale + punitivo)

## 🧪 Test e Verifica

### Link di Test Attivo
- **URL**: https://tus-tasklink.onrender.com
- **Test Organizzati**: Cartella `tests/`

### Script di Test Disponibili
```bash
cd tests
node test-racing.js        # Racing click game
node test-rigged.js        # Rigged racing game
node test-teleport.js      # Teleporting click game
node test-all-games.js     # Sequenza multi-game
node create-test-link.js   # Link generico
```

### Comportamenti Verificati
- ✅ Sistema intelligente seleziona template ottimali
- ✅ Template compositi per tempi lunghi (>90s)
- ✅ Varietà automatica e bilanciamento categorie
- ✅ Stime temporali accurate
- ✅ Sessioni stabili senza scadenze premature

## 📁 Struttura File Critici

```
backend/
├── routes/victim.js                    # 🔥 CORE - Gestione step utente
├── utils/advanced-template-system.js  # 🔥 CORE - Sistema template legacy + nuovo
├── utils/template-time-estimator.js   # 🧠 NEW - Stime temporali standardizzate
├── utils/smart-template-distributor.js # 🧠 NEW - Algoritmo selezione intelligente
├── utils/client-fingerprint.js        # 🔥 CORE - Sessioni utente stabili
├── templates/minimal-templates.js     # 🎨 UI - Template ottimizzati
└── config/database.js                 # 💾 DB - Wrapper MongoDB
```

## ⚠️ Punti Critici - NON MODIFICARE

### 🔒 Sistema Intelligente (template-time-estimator.js)
```javascript
// ❌ NON MODIFICARE le stime temporali senza testare!
// Ogni template ha calcoli specifici per frustrationFactor e variance
// Racing rigged: medium_racing_time + fake_time/10
// Compositi: calcolo basato su componenti reali
```

### 🔒 Distribuzione Template (smart-template-distributor.js)
```javascript
// ❌ NON FORZARE pesi artificiali!
// Sistema usa limiti realistici e bonus/penalty automatici
// Compositi preferiti automaticamente per targetTime > 90s
// Penalty per singoli oltre 80% del loro limite massimo
```

### 🔒 Sessioni Stabili (client-fingerprint.js)
```javascript
// ❌ NON AGGIUNGERE timestamp volatili al fingerprint!
// Fingerprint basato solo su IP + User-Agent + headers statici
// TTL sessioni = TTL URL per ottimizzare risorse
```

## 🎯 Meccanismi Frustranti Implementati

### 🏁 Racing Games
- **Game Over**: A 0 per più di 1s
- **Finto Loading**: 2s dopo "Try Again"
- **Timer Rigged**: In pausa quando non clicchi
- **Drain Dinamico**: Accelerazione esponenziale verso 80%

### 🔮 Teleporting Click
- **35% hover teleport**, **10% barriera**, **5s idle teleport**
- **Orb decorativo** fluttuante per distrazione

### ⏰ Timer Punitivo
- **Windows 95 style** con reload su focus loss
- **Penalty 1.5s + 2-5s random** su resume

## 🚀 Deploy

```bash
# Auto-deploy su ogni push
git add -A
git commit -m "🔧 Descrizione modifiche"
git push origin main
# Render.com fa deploy automatico
```

## 📊 Metriche Sistema Intelligente

### 🎯 Accuratezza Temporale
- **Target 120s**: Sistema sceglie template con stima ~120s
- **Compositi automatici**: Per tempi >90s per step
- **Varietà garantita**: Penalty ripetizione template

### 🧠 Algoritmo Selezione
1. **Viabilità**: Template deve essere nel range ±50% del target
2. **Precisione**: Bonus per vicinanza al tempo target
3. **Varietà**: Penalty per ripetizioni recenti
4. **Limiti**: Penalty per singoli vicini al limite massimo
5. **Compositi**: Bonus crescente per tempi lunghi

## 🔮 Prossimi Sviluppi

### Completato (Iterazione 23)
- **Sistema Intelligente**: ✅ Template selection ottimizzata
- **Template Limits**: ✅ Logica automatica per compositi
- **Time Estimator**: ✅ Stime standardizzate e scalabili
- **Racing Games**: ✅ Meccanismi frustranti perfezionati

### Roadmap Futura
- **Sistema Layered**: Minigiochi sovrapposti
- **Analytics Dashboard**: Metriche dettagliate
- **Custom Themes**: Personalizzazione UI
- **API Rate Limiting**: Protezione abuse

---

**🎯 Progetto Stabile e Intelligente - Pronto per Produzione**

*Deploy Live*: https://tus-tasklink.onrender.com
*Sistema*: Selezione template completamente automatizzata e ottimizzata