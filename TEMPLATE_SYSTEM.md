# TrollShortener - Sistema Template Avanzato

## ARCHITETTURA TEMPLATE

### **Template Atomici Base**
```javascript
{
  id: 'timer_simple',
  type: 'timer',
  estimatedTime: (duration) => duration, // Tempo fisso
  minDuration: 15,
  maxDuration: 60,
  stepSize: 5,
  generateDuration: (targetTime, constraints) => {
    // Genera durata basata su tempo target e vincoli
  }
}
```

### **Template Compositi**
```javascript
{
  id: 'timer_then_click',
  type: 'composite',
  components: ['timer_simple', 'click_simple'],
  estimatedTime: (components) => sum(components.estimatedTime),
  generateSequence: (targetTime, steps) => {
    // Distribuisce tempo tra componenti
  }
}
```

## SISTEMA VINCOLI TEMPORALI

### **Parametri Utente**
- **Tempo Medio**: 30s, 1min, 2min, 5min, 10min
- **Steps**: 1-5 (con limite dinamico basato su tempo)
- **Expiry**: 1h, 1d, 3d, 7d

### **Algoritmo Distribuzione Tempo**
```
1. Calcola tempo disponibile per step
2. Identifica template fissi (timer punish, ecc)
3. Distribuisce tempo rimanente su template dinamici
4. Valida vincoli (min 15s timer, max 60s timer)
5. Aggiusta se necessario
```

### **Limiti Step Dinamici**
```
Tempo 30s: max 2 steps
Tempo 1min: max 3 steps  
Tempo 2min: max 4 steps
Tempo 5min+: max 5 steps
```

## TEMPLATE DISPONIBILI

### **Atomici**
1. **timer_simple**: Timer normale (15-60s, step 5s)
2. **timer_punish**: Timer punitivo (20-45s, reset su focus loss)
3. **click_simple**: Click game (3-15 clicks, ~5 click/sec)
4. **click_drain**: Click con drain (10-30 clicks, drain progressivo)

### **Compositi** 
1. **timer_then_click**: Timer → Click
2. **click_then_timer**: Click → Timer nascosto
3. **double_timer**: Timer semplice → Timer punitivo
4. **mixed_challenge**: Timer + Click simultanei

## SISTEMA RNG MIGLIORATO

### **Seed Generation**
```javascript
// Seed basato su: timestamp + fingerprint + shortId
const seed = hash(Date.now() + fingerprint + shortId + Math.random());
```

### **Template Selection**
```javascript
// Peso basato su tempo disponibile e step rimanenti
const weights = templates.map(t => calculateWeight(t, remainingTime, remainingSteps));
const selected = weightedRandom(templates, weights);
```

## SISTEMA PUNIZIONI

### **Trigger Punizioni**
- Cookie tampering
- Focus loss ripetuto  
- Pattern bot detection
- Step sequence violation

### **Tipi Punizione**
- **+1 Step**: Aggiunge step extra
- **Time Reset**: Reset timer corrente
- **Template Swap**: Cambia template a metà
- **Infinite Loop**: Loop infinito per bot

### **Implementazione**
```javascript
// Punizioni sono ESENTI da vincoli temporali
const penalty = {
  type: 'extra_step',
  template: 'timer_punish_60s', // Ignora vincoli utente
  reason: 'cookie_tamper'
};
```

## DEBUG E TESTING

### **Debug Temporanei**
- Log generazione template con timing
- Validazione vincoli in real-time
- Tracking seed e randomizzazione
- Monitoring distribuzione tempo

### **Test Cases**
1. Tempo 30s, 2 steps → Verifica distribuzione
2. Tempo 5min, 5 steps → Verifica limiti
3. Template compositi → Verifica timing
4. Punizioni → Verifica bypass vincoli

## IMPLEMENTAZIONE FASI

### **FASE 1**: Sistema Vincoli Base
- [ ] Parametri utente frontend
- [ ] Algoritmo distribuzione tempo
- [ ] Limiti step dinamici
- [ ] Validazione vincoli

### **FASE 2**: Template Avanzati  
- [ ] Template compositi
- [ ] RNG migliorato con seed
- [ ] Peso template basato su vincoli
- [ ] Debug timing completo

### **FASE 3**: Sistema Punizioni
- [ ] Detection tampering avanzato
- [ ] Punizioni esenti da vincoli
- [ ] Progressive penalty system
- [ ] Bot detection patterns

## NOTE CRITICHE

⚠️ **Seed RNG**: Deve essere diverso per ogni generazione
⚠️ **Vincoli Timer**: 15-60s step 5s SEMPRE rispettati
⚠️ **Click Timing**: 5 click/sec stima base
⚠️ **Punizioni**: ESENTI da tutti i vincoli utente
⚠️ **Debug**: Logging completo per troubleshooting