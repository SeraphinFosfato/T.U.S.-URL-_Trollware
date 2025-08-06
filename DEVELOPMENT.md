# TrollShortener - Development Guide

## 🛠️ SETUP SVILUPPO

### **Prerequisiti**
- Node.js 18+
- Git
- Editor con supporto JavaScript

### **Installazione**
```bash
git clone https://github.com/SeraphinFosfato/T.U.S.-URL-_Trollware.git
cd troll-url-shortener
npm install
```

### **Avvio Locale**
```bash
# Sviluppo
npm run dev

# Produzione locale
npm start

# Server disponibile su http://localhost:3000
```

## 🧪 TESTING WORKFLOW

### **Test Rapidi Locali**
```bash
# Test sistema template
node tests/test-composite-expansion.js
node tests/test-smart-distributor.js
node tests/test-template-estimator.js

# Test generazione parametri
node tests/test-parameter-generation.js
```

### **Test Reali su Render**
```bash
# Genera tutti i link di test (14 template)
node tests/generate-real-test-links.js

# Verifica deploy attivo
node tests/check-deploy-status.js

# Test template specifico
curl -X POST "https://tus-tasklink.onrender.com/api/shorten" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","testTemplate":"racing_then_teleport"}'
```

### **Standardizzazione Testing**
- **Valori Minimi**: 5s timer, 5 click per test rapidi
- **Multipli di 5**: Tutti i parametri numerici
- **Max 60s**: Limite per blocco singolo
- **Compositi**: Espansione automatica in step multipli

## 🔧 MODIFICA TEMPLATE

### **Aggiungere Nuovo Template Atomico**

1. **Template Time Estimator** (`backend/utils/template-time-estimator.js`):
```javascript
new_template: {
  type: 'calculated|direct|dynamic',
  baseTime: (params) => calculationLogic,
  variance: 0.1-0.5,
  frustrationFactor: 1.0-1.8
}
```

2. **Smart Distributor** (`backend/utils/smart-template-distributor.js`):
```javascript
baseWeights: {
  new_template: 1.0  // Peso base
},
templateLimits: {
  new_template: 60   // Limite massimo
}
```

3. **Minimal Templates** (`backend/templates/minimal-templates.js`):
```javascript
new_template: (mode, params, nextUrl) => {
  return `<html><!-- Template HTML --></html>`;
}
```

4. **Victim Route** (`backend/routes/victim.js`):
```javascript
// Aggiungi case in generateStepHTML()
if (template.subtype === 'new_template') {
  return minimalTemplates.new_template('step', template.params, nextUrl);
}
```

### **Aggiungere Template Composito**

1. **Advanced Template System** (`backend/utils/advanced-template-system.js`):
```javascript
// Aggiungi in expandCompositeTemplate()
case 'new_composite':
  return [
    { type: 'timer', subtype: 'timer_simple', duration: 30 },
    { type: 'click', subtype: 'click_simple', target: 20 }
  ];
```

2. **Revenue System** (Smart Distributor):
```javascript
templateRevenue: {
  new_composite: 5  // Revenue score 1-8
}
```

## 🐛 DEBUG WORKFLOW

### **Logging Attivo**
Il sistema include logging dettagliato per debug:
```javascript
const logger = require('../utils/debug-logger');
logger.info('TEMPLATE', 'Message', { data });
logger.warn('TEMPLATE', 'Warning', { context });
logger.error('TEMPLATE', 'Error', { error });
```

### **Debug Template Compositi**
```bash
# Verifica espansione locale
node tests/test-composite-expansion.js

# Controlla log Render per errori espansione
# Se template composito arriva a generateStepHTML = BUG
```

### **Debug Selezione Template**
```bash
# Test distributor con parametri specifici
node tests/test-smart-distributor.js

# Verifica pesi e viabilità template
# Log mostra decisioni algoritmo intelligente
```

## 📊 METRICHE SVILUPPO

### **Performance Targets**
- **Accuratezza Temporale**: ±10% dal tempo target
- **Template Compositi**: ±15% per complessità espansione
- **Response Time**: <500ms per generazione template
- **Memory Usage**: <100MB per istanza Render

### **Quality Gates**
- **Test Coverage**: Tutti i template testati
- **Error Handling**: Fallback robusti implementati
- **Cross-Browser**: Compatibilità IE11+
- **Mobile**: Responsive design verificato

## 🚀 DEPLOYMENT PROCESS

### **Pre-Deploy Checklist**
- [ ] Test locali passano
- [ ] Template compositi espandono correttamente
- [ ] Parametri rispettano multipli di 5
- [ ] Limiti 60s rispettati
- [ ] Revenue system funzionante

### **Deploy su Render**
```bash
# Commit modifiche
git add .
git commit -m "Feature: Description"
git push origin main

# Render auto-deploy attivo (~2-3 minuti)
# Verifica con check-deploy-status.js
```

### **Post-Deploy Verification**
```bash
# Genera link di test
node tests/generate-real-test-links.js

# Test manuale template critici
# - Template compositi multi-step
# - Parametri multipli di 5
# - Limiti temporali rispettati
```

## 🔄 WORKFLOW OTTIMIZZATO

### **Ciclo Sviluppo Rapido**
1. **Modifica Locale**: Implementa feature
2. **Test Locale**: Verifica logica con test suite
3. **Commit & Push**: Deploy automatico su Render
4. **Test Reale**: Verifica su deployment live
5. **Iterate**: Ripeti per ottimizzazioni

### **Best Practices**
- **Atomic Commits**: Una feature per commit
- **Descriptive Messages**: Commit message chiari
- **Test First**: Test prima dell'implementazione
- **Documentation**: Aggiorna docs per nuove feature

## 🎯 TROUBLESHOOTING COMUNE

### **Template Compositi Non Funzionano**
```bash
# Verifica espansione
node tests/test-composite-expansion.js

# Controlla log per "COMPOSITE TEMPLATE IN generateStepHTML"
# Se presente = bug nell'espansione
```

### **Parametri Non Multipli di 5**
```bash
# Verifica generazione parametri
node tests/test-parameter-generation.js

# Controlla template-time-estimator.js
# Tutti i calcoli devono usare Math.round(value/5)*5
```

### **Deploy Non Attivo**
```bash
# Verifica status
node tests/check-deploy-status.js

# Controlla Render dashboard
# Build logs per errori
```

### **Performance Degradation**
```bash
# Profiling locale
node --prof backend/server.js

# Analisi memory leaks
node --inspect backend/server.js

# Ottimizzazione query database
```

---

**Development Guide Version**: 2.4  
**Last Updated**: Testing Optimization Phase  
**Target**: Sviluppo rapido e testing efficiente