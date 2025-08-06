# TrollShortener - Sistema Template Intelligente

## ARCHITETTURA SISTEMA INTELLIGENTE (Iterazione 24 - Testing Optimized)

### **🚀 STANDARDIZZAZIONE TESTING**
Sistema ottimizzato per testing rapido con vincoli rigorosi:
- **Valori Bassi**: Tempi minimi per ridurre spreco durante test
- **Multipli di 5**: Tutti i valori numerici (click, secondi) sono multipli di 5
- **Max 60s per Blocco**: Limite massimo 60 secondi per singolo template
- **Espansione Compositi**: Template compositi espansi correttamente in step atomici multipli

### **🧠 Template Time Estimator**
Sistema standardizzato per stime temporali accurate di ogni template.

```javascript
// Struttura standardizzata
{
  templateId: {
    type: 'direct|multiplied|calculated|dynamic|composite',
    baseTime: (params) => calculatedTime,
    variance: 0.1-0.5,           // Varianza utente
    frustrationFactor: 1.0-1.8   // Fattore frustrazione
  }
}
```

### **🎯 Smart Template Distributor**
Algoritmo intelligente per selezione ottimale basata su:
1. **Viabilità**: Template nel range ±50% del tempo target
2. **Precisione**: Bonus per vicinanza temporale
3. **Varietà**: Penalty per ripetizioni recenti
4. **Limiti**: Penalty per singoli oltre 80% del limite massimo
5. **Compositi**: Bonus crescente per tempi lunghi

## TEMPLATE DISPONIBILI (13 Totali)

### **⏱️ Timer Templates (2)**

#### timer_simple
```javascript
{
  type: 'direct',
  baseTime: (duration) => duration,
  variance: 0.1,
  frustrationFactor: 1.0,
  limits: { min: 5, max: 60, step: 5 }  // TESTING: min ridotto a 5s
}
```

#### timer_punish  
```javascript
{
  type: 'multiplied',
  baseTime: (duration) => duration,
  variance: 0.2,
  frustrationFactor: 1.5,  // 50% più lento per punizioni
  limits: { min: 5, max: 45, step: 5 }  // TESTING: min ridotto a 5s
}
```

### **🖱️ Click Templates (4)**

#### click_simple
```javascript
{
  type: 'calculated',
  baseTime: (clicks) => clicks * 0.5,  // 0.5s per click + delay random 0.4-0.6s
  variance: 0.15,
  frustrationFactor: 1.0,
  limits: { min: 5, max: 30, step: 5 }  // TESTING: max ridotto a 30, multipli di 5
}
```

#### click_drain
```javascript
{
  type: 'calculated',
  baseTime: (clicks) => clicks * 0.67,  // Più lento per drain
  variance: 0.2,
  frustrationFactor: 1.1,
  limits: { min: 5, max: 30, step: 5 }  // TESTING: max ridotto a 30, multipli di 5
}
```

#### click_teleport
```javascript
{
  type: 'calculated', 
  baseTime: (clicks) => clicks * 0.8,   // Più lento per teleport
  variance: 0.3,                        // Alta varianza per frustrazione
  frustrationFactor: 1.4,
  limits: { min: 5, max: 30, step: 5 }  // TESTING: max ridotto a 30, multipli di 5
}
```

#### click_racing
```javascript
{
  type: 'dynamic',
  baseTime: (params) => {
    const baseDuration = params.duration || 30;
    const drainRate = params.drain || 1.0;
    const difficultyMultiplier = drainRate <= 0.6 ? 0.8 : 
                                 drainRate <= 1.0 ? 1.0 : 1.3;
    return baseDuration * difficultyMultiplier;
  },
  variance: 0.4,
  frustrationFactor: 1.2,
  limits: { min: 5, max: 60, step: 5 }  // TESTING: max ridotto a 60s, multipli di 5
}
```

#### click_racing_rigged
```javascript
{
  type: 'dynamic',
  baseTime: (params) => {
    // Formula: medium_racing_time + fake_time/10
    const baseDuration = params.realDuration || 20;
    const mediumRacingTime = baseDuration * 1.0;
    const fakeTimeBonus = baseDuration / 10;
    return mediumRacingTime + fakeTimeBonus;
  },
  variance: 0.4,
  frustrationFactor: 1.2,
  limits: { min: 5, max: 60, step: 5 }  // TESTING: max ridotto a 60s, multipli di 5
}
```

### **🔄 Template Compositi Base (3)**

#### timer_then_click
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 60;
    const timerTime = totalTime * 0.6;      // 60% timer
    const clickTime = totalTime * 0.4;      // 40% click
    return timerTime + (clickTime / 0.5) * 0.5;  // Timer diretto + click calc
  },
  variance: 0.25,
  frustrationFactor: 1.0,
  components: ['timer_simple', 'click_simple']
}
```

#### click_then_timer
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 60;
    const clickTime = totalTime * 0.4;      // 40% click
    const timerTime = totalTime * 0.6;      // 60% timer
    return (clickTime / 0.5) * 0.5 + timerTime;
  },
  variance: 0.25,
  frustrationFactor: 1.0,
  components: ['click_simple', 'timer_simple']
}
```

#### double_timer
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 60;
    const firstTimer = totalTime * 0.5;     // Timer normale
    const secondTimer = totalTime * 0.5 * 1.5;  // Timer punitivo (1.5x)
    return firstTimer + secondTimer;
  },
  variance: 0.3,
  frustrationFactor: 1.0,
  components: ['timer_simple', 'timer_punish']
}
```

### **🚀 Template Compositi Avanzati (4)**

#### racing_then_teleport
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 90;
    const racingTime = totalTime * 0.6;     // 60% racing
    const teleportTime = totalTime * 0.4;   // 40% teleport
    return racingTime * 1.2 + (teleportTime / 0.8) * 0.8 * 1.4;
  },
  variance: 0.35,
  frustrationFactor: 1.0,
  components: ['click_racing', 'click_teleport']
}
```

#### teleport_then_racing
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 90;
    const teleportTime = totalTime * 0.4;
    const racingTime = totalTime * 0.6;
    return (teleportTime / 0.8) * 0.8 * 1.4 + racingTime * 1.2;
  },
  variance: 0.35,
  frustrationFactor: 1.0,
  components: ['click_teleport', 'click_racing']
}
```

#### triple_click
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 120;
    // Simple -> Drain -> Teleport (escalation)
    return totalTime * 0.33 * 0.5 + totalTime * 0.33 * 0.67 + totalTime * 0.34 * 0.8 * 1.4;
  },
  variance: 0.4,
  frustrationFactor: 1.0,
  components: ['click_simple', 'click_drain', 'click_teleport']
}
```

#### racing_sandwich
```javascript
{
  type: 'composite',
  baseTime: (params) => {
    const totalTime = params.totalTime || 150;
    // Racing -> Timer -> Racing Rigged
    return totalTime * 0.4 * 1.2 + totalTime * 0.2 + totalTime * 0.4 * 1.2;
  },
  variance: 0.45,
  frustrationFactor: 1.0,
  components: ['click_racing', 'timer_simple', 'click_racing_rigged']
}
```

## 💰 SISTEMA REVENUE

### **📊 Revenue per Template**
```javascript
// Template singoli - revenue bassa (1-4)
timer_simple: 1        click_simple: 1
timer_punish: 2        click_drain: 2
click_teleport: 3      click_racing: 2
click_racing_rigged: 4

// Template compositi base - revenue media (3-4)
timer_then_click: 3    click_then_timer: 3
double_timer: 4

// Template compositi avanzati - revenue alta (5-8)
racing_then_teleport: 5    teleport_then_racing: 5    // 2 step ciascuno
triple_click: 7            racing_sandwich: 8          // 3 step ciascuno
```

### **🎯 Slot Pubblicitari**
```javascript
adSlots: {
  header: { threshold: 2 },        // Banner header
  sidebar: { threshold: 4 },       // Sidebar ads
  footer: { threshold: 3 },        // Footer banner
  interstitial: { threshold: 6 },  // Popup interstitial
  overlay: { threshold: 8 }        // Overlay ads
}
```

### **💳 Piani Utente**
- **FREE**: Revenue 1.0x - Tutti gli slot attivi per template avanzati
- **PREMIUM**: Revenue 0.5x - Slot ridotti, meno pubblicità
- **VIP**: Revenue 0x - Solo minigioco, nessuna pubblicità

## ALGORITMO SELEZIONE INTELLIGENTE

### **Fase 1: Viabilità**
```javascript
// Template è viable se può raggiungere il tempo target ±50%
isTemplateViable(templateId, targetTime, params) {
  const range = getTimeRange(templateId, params);
  const tolerance = 0.5;
  const minAcceptable = targetTime * (1 - tolerance);
  const maxAcceptable = targetTime * (1 + tolerance);
  return range.expected >= minAcceptable && range.expected <= maxAcceptable;
}
```

### **Fase 2: Calcolo Peso Dinamico**
```javascript
// Peso finale basato su multiple metriche
let weight = baseWeight;

// 1. Bonus precisione temporale
const timeDiff = Math.abs(timeRange.expected - targetTime);
const precisionBonus = Math.max(0, 1 - (timeDiff / targetTime));
weight *= (1 + precisionBonus);

// 2. Penalty varietà (ripetizioni)
const recentUse = history.filter(h => h.templateId === templateId).length;
const varietyPenalty = Math.pow(0.7, recentUse);
weight *= varietyPenalty;

// 3. Bonus compositi per tempi lunghi
if (isComposite && targetTime > 45) {
  const compositeBonus = Math.min((targetTime - 45) / 30, 3); // Max 3x, inizia da 45s
  weight *= (1 + compositeBonus);
}

// 4. Penalty singoli vicini al limite
if (!isComposite && targetTime > limit * 0.8) {
  const limitPenalty = (targetTime - limit * 0.8) / (limit * 0.2);
  weight *= Math.max(0.3, 1 - limitPenalty * 0.7); // Max 70% penalty
}
```

### **Fase 3: Selezione Pesata**
```javascript
// Selezione basata su peso finale
const totalWeight = templates.reduce((sum, t) => sum + t.finalWeight, 0);
let random = rng() * totalWeight;

for (const template of templates) {
  random -= template.finalWeight;
  if (random <= 0) return template.templateId;
}
```

## LIMITI TEMPLATE TESTING

```javascript
// Limiti ottimizzati per testing rapido
templateLimits = {
  timer_simple: 60,     // Max 60s, step 5s
  timer_punish: 45,     // Max 45s, step 5s
  click_simple: 15,     // Max 30 click (15s), multipli di 5
  click_drain: 20,      // Max 30 click (20s), multipli di 5
  click_teleport: 25,   // Max 30 click (25s), multipli di 5
  click_racing: 60,     // Max 60s per testing
  click_racing_rigged: 60 // Max 60s per testing
}
```

## 🔧 SISTEMA ESPANSIONE COMPOSITI

### **Espansione Automatica**
I template compositi vengono automaticamente espansi in step atomici:

```javascript
// Esempio: racing_then_teleport (120s target)
expandCompositeTemplate('racing_then_teleport', 120) => [
  {
    type: 'click',
    subtype: 'click_racing',
    params: { duration: 70, drain: 0.8 },  // 60% del tempo, max 60s
    estimatedTime: 70
  },
  {
    type: 'click', 
    subtype: 'click_teleport',
    target: 25,  // 40% del tempo, multipli di 5
    estimatedTime: 50
  }
]
```

### **Vincoli Espansione**
- **Distribuzione Temporale**: Rispetta percentuali definite per ogni composito
- **Multipli di 5**: Tutti i parametri (duration, target) sono multipli di 5
- **Limite 60s**: Ogni step espanso rispetta il limite massimo di 60s
- **Arrotondamento Intelligente**: Valori arrotondati mantenendo tempo totale

## 🧪 TESTING INFRASTRUCTURE

### **Test Locali**
```bash
# Test espansione compositi
node tests/test-composite-expansion.js

# Test logica distributor
node tests/test-smart-distributor.js
```

### **Test Reali su Render**
```bash
# Genera tutti i link di test
node tests/generate-real-test-links.js

# Verifica deploy status
node tests/check-deploy-status.js
```

### **Link di Test Rapidi**
- **Timer 5s**: Testa timer minimo
- **Click 5**: Testa click minimo
- **Racing 15s**: Testa racing breve
- **Composito 30s**: Testa espansione multi-step

## 📊 METRICHE PERFORMANCE

### **Accuratezza Temporale**
- **Target**: ±10% dal tempo richiesto
- **Compositi**: ±15% per complessità espansione
- **Varianza Utente**: Considerata nel calcolo finale

### **Distribuzione Template**
```javascript
// Pesi base ottimizzati per testing
baseWeights = {
  // Singoli: peso normale per test rapidi
  timer_simple: 1.0,
  click_simple: 1.2,
  
  // Compositi: peso ridotto per evitare complessità eccessiva
  racing_then_teleport: 0.6,
  triple_click: 0.4,
  racing_sandwich: 0.3
}
```

## 🚀 DEPLOYMENT STATUS

### **Render Auto-Deploy**
- **Branch**: main
- **Trigger**: Push automatico
- **Build Time**: ~2-3 minuti
- **Health Check**: Template compositi funzionanti

### **Verifica Funzionamento**
1. **Template Singoli**: Rispettano multipli di 5 e limiti
2. **Template Compositi**: Espansi correttamente in step multipli
3. **Sistema Revenue**: Calcolo corretto per slot pubblicitari
4. **Sessioni Utente**: Progressione multi-step stabile

## 📈 ROADMAP FUTURE

### **Ottimizzazioni Pianificate**
- **Template Dinamici**: Generazione runtime basata su metriche utente
- **A/B Testing**: Confronto efficacia template diversi
- **Machine Learning**: Predizione template ottimale per utente
- **Analytics Avanzate**: Tracking dettagliato comportamento utente

### **Nuovi Template Types**
- **Hybrid Templates**: Combinazioni dinamiche timer+click
- **Adaptive Difficulty**: Difficoltà che si adatta alle performance utente
- **Social Templates**: Sfide collaborative multi-utente
- **Seasonal Templates**: Template tematici per eventi speciali

---

**Ultima Modifica**: Iterazione 24 - Testing Optimization  
**Status**: ✅ Deploy Attivo su Render  
**Template Compositi**: ✅ Funzionanti  
**Testing**: ✅ Ottimizzato per sviluppo rapidoiù
  // Compositi: nessun limite rigido
}
```

## MECCANISMI FRUSTRANTI IMPLEMENTATI

### **🏁 Racing Games**
- **Game Over**: A 0 per più di 1s
- **Finto Loading**: 2s dopo "Try Again"  
- **Timer Rigged**: In pausa quando non clicchi
- **Drain Dinamico**: Accelerazione esponenziale verso 80%

### **🔮 Teleporting Click**
- **35% hover teleport**, **10% barriera**, **5s idle teleport**
- **Orb decorativo** fluttuante per distrazione

### **⏰ Timer Punitivo**
- **Windows 95 style** con reload su focus loss
- **Penalty 1.5s + 2-5s random** su resume

### **🎮 Click Games**
- **Delay randomizzato**: 0.4-0.6s per click_simple
- **Drain progressivo**: click_drain più lento
- **Teleport frustrante**: Button che si sposta

## TESTING E DEBUG

### **Script di Test**
```bash
cd tests
# Test locali (logica)
node quick-template-test.js        # Test sistema completo
node revenue-comparison.js         # Confronto revenue
node debug-weights.js              # Debug pesi template

# Test su Render (UI reale)
node generate-real-test-links.js   # Genera link per tutti i template
node batch-template-test.js        # Batch test + HTML
node test-revenue-on-render.js     # Test revenue su server

# Test legacy
node test-racing.js                # Racing click game
node test-rigged.js                # Rigged racing game  
node test-teleport.js              # Teleporting click game
node create-test-link.js           # Link generico
```

### **Debug Template Selection**
```javascript
// Log automatico per ogni selezione
DEBUG: Template timer_simple, targetTime: 120, 
       params: { duration: 120 }, 
       timeRange: { min: 108, max: 132, expected: 120 }, 
       viable: true

DEBUG: Found 7 viable templates for targetTime 120
```

### **Metriche di Successo**
- **Accuratezza temporale**: ~90%+ (accuracy < 0.1)
- **Varietà template**: Penalty ripetizioni automatica
- **Preferenza compositi**: Automatica per tempi >90s
- **Stabilità sessioni**: TTL ottimizzato

## IMPLEMENTAZIONE FASI COMPLETATE

### **✅ FASE 1**: Sistema Intelligente Base
- Template Time Estimator standardizzato
- Smart Template Distributor con algoritmo ottimale
- Limiti template e logica viabilità
- Selezione automatica compositi

### **✅ FASE 2**: Template Avanzati
- 9 template totali (6 atomici + 3 compositi)
- Racing games con meccanismi diabolici
- Stime temporali accurate per ogni tipo
- Sistema RNG deterministico

### **✅ FASE 3**: Ottimizzazioni
- Sessioni stabili con fingerprint
- Fallback robusti multi-livello
- Deploy automatico e monitoring
- Suite test completa

### **✅ FASE 4**: Sistema Revenue (Iterazione 24)
- 13 template totali con revenue 1-8
- 5 slot pubblicitari dinamici
- 3 piani utente (FREE/PREMIUM/VIP)
- Sistema advertising scalabile

### **✅ FASE 5**: Fix Template Compositi (Iterazione 25)
- Template compositi ora espansi in step multipli atomici
- Fix bug: compositi non più convertiti in timer singolo
- Ogni step del composito gestito separatamente
- Sistema multi-step funzionante per tutti i 13 template

---

**🎯 Sistema Template + Revenue + Multi-Step Completamente Funzionante**

*13 template, sistema revenue, compositi multi-step, test completi su Render*