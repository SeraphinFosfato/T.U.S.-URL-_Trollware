# 🔧 TrollShortener - Documentazione Tecnica

## 📋 Modus Operandi per Future Istanze

### 🎯 Approccio Sviluppo
1. **Analisi Prima**: Leggere sempre i file critici prima di modificare
2. **Test Immediati**: Creare test per ogni modifica importante
3. **Commit Frequenti**: Ogni fix deve essere committato e pushato
4. **Iterazioni Brevi**: Max 15-20 modifiche per istanza
5. **Deploy Continuo**: Render.com fa auto-deploy da GitHub

### 🧪 Workflow Test Standard
```bash
# 1. Test funzionalità specifica
node test-[feature].js

# 2. Test consistenza generale
node test-reload-consistency.js

# 3. Commit e deploy
git add -A && git commit -m "🔧 Fix: descrizione"
git push origin main

# 4. Verifica live
curl https://tus-tasklink.onrender.com
```

## 🔥 File Critici - ATTENZIONE

### victim.js - Gestione Step Utente
**CRITICO**: Non modificare la logica di redirect finale
```javascript
// ❌ NON TOCCARE!
if (currentStep >= pathData.templates.length) {
  return res.redirect(urlData.original_url);
}
```

### advanced-template-system.js - RNG Deterministico
**CRITICO**: Seed deve essere deterministico
```javascript
// ✅ CORRETTO - Solo fingerprint + shortId
generateImprovedSeed(fingerprint, shortId) {
  const components = [fingerprint, shortId, 'troll_rng_salt_2024'];
}

// ❌ MAI FARE - Rende seed non deterministico
generateImprovedSeed(fingerprint, shortId) {
  const components = [Date.now(), Math.random(), fingerprint]; // NO!
}
```

### client-fingerprint.js - Sistema Sessioni
**CRITICO**: Sistema fallback a 3 livelli
1. Cookie criptato
2. localStorage
3. Database fallback

Non rimuovere nessun livello!

## 🎮 Sistema Template

### Struttura Template
```javascript
{
  type: 'timer|click|composite',
  subtype: 'timer_simple|click_simple|etc',
  duration: 30,           // Per timer
  target: 10,            // Per click
  estimatedTime: 25,     // Tempo stimato completamento
  sequence: []           // Per compositi
}
```

### Aggiunta Nuovi Template
1. **Definire in advanced-template-system.js**
2. **Aggiungere logica in generateStepHTML() in victim.js**
3. **Creare template HTML in minimal-templates.js**
4. **Testare con script dedicato**

## 🚨 Errori Comuni da Evitare

### ❌ Seed Non Deterministico
```javascript
// SBAGLIATO - Cambia ad ogni reload
const seed = Date.now() + Math.random();

// CORRETTO - Stesso fingerprint = stesso seed
const seed = crypto.hash(fingerprint + shortId + salt);
```

### ❌ Modificare Logica Step
```javascript
// SBAGLIATO - Rompe il flusso
if (currentStep > pathData.templates.length) { // > invece di >=

// CORRETTO - Logica testata e funzionante
if (currentStep >= pathData.templates.length) {
```

### ❌ Rimuovere Fallback Sessioni
```javascript
// SBAGLIATO - Rimuove robustezza
if (pathCookie) {
  pathData = decryptPath(pathCookie);
}
// Manca fallback DB!

// CORRETTO - Fallback completo
if (pathCookie) {
  pathData = decryptPath(pathCookie);
}
if (!pathData) {
  pathData = await db.getClientPath(pathHash); // Fallback DB
}
```

## 🔄 Pattern di Sviluppo

### Aggiunta Nuova Funzionalità
1. **Analisi**: Leggere codice esistente
2. **Design**: Pianificare integrazione
3. **Implementazione**: Codice minimale
4. **Test**: Script di verifica
5. **Deploy**: Commit e push
6. **Verifica**: Test live

### Debug Problemi
1. **Log Analysis**: Controllare debug-logger output
2. **Test Isolato**: Creare test specifico per problema
3. **Fix Minimale**: Modificare solo il necessario
4. **Regression Test**: Verificare che non si rompa altro

## 📊 Metriche di Successo

### Test Automatici
- ✅ `test-reload-consistency.js` - RNG deterministico
- ✅ `test-final-step.js` - Logica ultimo step
- ✅ `create-test-link.js` - Creazione link test

### Comportamenti Attesi
- Stesso fingerprint = sequenza identica sempre
- Fingerprint diversi = sequenze diverse
- Reload non cambia percorso
- Continue button funziona
- Redirect finale corretto

## 🎯 Obiettivi Iterazione

### Sempre Mantenere
- Stabilità sistema core
- Performance ottimali
- Esperienza utente fluida
- Robustezza sessioni

### Possibili Miglioramenti
- Nuovi template/minigiochi
- Ottimizzazioni UI
- Analytics/statistiche
- Monetizzazione

---

**⚠️ IMPORTANTE**: Prima di modificare codice critico, creare sempre backup e test!

**🎯 OBIETTIVO**: Mantenere stabilità mentre si aggiungono funzionalità