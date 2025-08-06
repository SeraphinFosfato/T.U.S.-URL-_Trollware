# TrollShortener - Architettura Sistema

## 🏗️ OVERVIEW ARCHITETTURALE

### **Stack Tecnologico**
- **Backend**: Node.js + Express
- **Database**: SQLite con WAL mode
- **Frontend**: HTML5 + CSS3 + Vanilla JS
- **Deploy**: Render (auto-deploy da GitHub)
- **Testing**: Custom test suite + Render integration

### **Struttura Progetto**
```
troll-url-shortener/
├── backend/
│   ├── routes/           # API endpoints
│   ├── utils/            # Sistema template intelligente
│   ├── templates/        # Template HTML minigiochi
│   ├── config/           # Configurazioni DB e tier
│   └── server.js         # Entry point
├── frontend/             # Assets statici
├── tests/                # Test suite completa
└── docs/                 # Documentazione
```

## 🧠 SISTEMA TEMPLATE INTELLIGENTE

### **Componenti Core**

#### **1. Template Time Estimator**
- **File**: `backend/utils/template-time-estimator.js`
- **Funzione**: Calcolo preciso tempi stimati per ogni template
- **Algoritmi**: 5 tipi di calcolo (direct, multiplied, calculated, dynamic, composite)

#### **2. Smart Template Distributor**
- **File**: `backend/utils/smart-template-distributor.js`
- **Funzione**: Selezione intelligente template basata su vincoli
- **Metriche**: Viabilità, precisione, varietà, limiti, compositi

#### **3. Advanced Template System**
- **File**: `backend/utils/advanced-template-system.js`
- **Funzione**: Orchestrazione completa e espansione compositi
- **Features**: RNG deterministico, espansione multi-step, fallback robusti

### **Flusso Generazione Template**
```
1. Richiesta utente (timePreset, steps)
2. Smart Distributor → selezione template ottimali
3. Time Estimator → calcolo parametri precisi
4. Advanced System → espansione compositi in step atomici
5. Victim Route → rendering HTML per ogni step
6. Client → esecuzione minigioco sequenziale
```

## 🎮 SISTEMA MINIGIOCHI

### **Template Atomici (8)**
- **Timer**: `timer_simple`, `timer_punish`
- **Click**: `click_simple`, `click_drain`, `click_teleport`
- **Racing**: `click_racing`, `click_racing_rigged`

### **Template Compositi (5)**
- **Base**: `timer_then_click`, `click_then_timer`, `double_timer`
- **Avanzati**: `racing_then_teleport`, `teleport_then_racing`, `triple_click`, `racing_sandwich`

### **Espansione Multi-Step**
I template compositi vengono espansi automaticamente:
```javascript
racing_then_teleport → [click_racing, click_teleport]
triple_click → [click_simple, click_drain, click_teleport]
racing_sandwich → [click_racing, timer_simple, click_racing_rigged]
```

## 💰 SISTEMA REVENUE

### **Revenue Scoring**
- **Template Singoli**: 1-4 punti
- **Template Compositi Base**: 3-4 punti
- **Template Compositi Avanzati**: 5-8 punti

### **Slot Pubblicitari Dinamici**
```javascript
adSlots = {
  header: { threshold: 2 },
  sidebar: { threshold: 4 },
  footer: { threshold: 3 },
  interstitial: { threshold: 6 },
  overlay: { threshold: 8 }
}
```

## 🗄️ SISTEMA DATABASE

### **Tabelle Principali**
- **urls**: Link accorciati e configurazioni
- **client_paths**: Sessioni utente e progressi
- **stats**: Metriche e analytics

### **Gestione Sessioni**
- **Fingerprinting**: Identificazione utente cross-device
- **Path Tracking**: Progressione multi-step persistente
- **Fallback Robusti**: Recovery automatico sessioni perse

## 🔧 TESTING INFRASTRUCTURE

### **Test Locali**
```bash
node tests/test-composite-expansion.js    # Test espansione compositi
node tests/test-smart-distributor.js      # Test logica selezione
node tests/test-template-estimator.js     # Test calcoli temporali
```

### **Test Reali**
```bash
node tests/generate-real-test-links.js    # Genera link su Render
node tests/check-deploy-status.js         # Verifica deploy
```

### **Standardizzazione Testing**
- **Valori Bassi**: Min 5s/5click per test rapidi
- **Multipli di 5**: Tutti i parametri numerici
- **Max 60s**: Limite per singolo blocco
- **Auto-Deploy**: Render sync con GitHub main branch

## 🚀 DEPLOYMENT PIPELINE

### **Render Configuration**
- **Build Command**: `npm install`
- **Start Command**: `node backend/server.js`
- **Environment**: Node.js 18+
- **Auto-Deploy**: Trigger su push main branch

### **Health Checks**
1. **Server Startup**: Express listening su porta
2. **Database**: SQLite connection e tabelle
3. **Template System**: Espansione compositi funzionante
4. **API Endpoints**: /api/shorten e /v/:shortId attivi

## 📊 MONITORING & ANALYTICS

### **Metriche Tracked**
- **Template Usage**: Distribuzione per tipo
- **Completion Rates**: % utenti che completano
- **Time Accuracy**: Differenza stimato vs reale
- **Revenue Generation**: Slot pubblicitari attivati

### **Debug Logging**
- **Template Selection**: Decisioni algoritmo intelligente
- **Composite Expansion**: Step generati per compositi
- **Session Management**: Tracking progressi utente
- **Error Handling**: Fallback e recovery automatici

## 🔮 ARCHITETTURA FUTURE

### **Scalabilità Pianificata**
- **Database Migration**: SQLite → PostgreSQL per produzione
- **Caching Layer**: Redis per sessioni e template
- **Load Balancing**: Multiple Render instances
- **CDN Integration**: Assets statici ottimizzati

### **Features Avanzate**
- **Machine Learning**: Predizione template ottimali
- **Real-time Analytics**: Dashboard live metriche
- **A/B Testing**: Confronto efficacia template
- **Social Features**: Sfide collaborative multi-utente

---

**Architettura Version**: 2.4  
**Last Updated**: Testing Optimization Phase  
**Status**: ✅ Production Ready su Render