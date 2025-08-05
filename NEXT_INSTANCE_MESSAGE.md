# 🤖 Messaggio per Prossima Istanza Amazon Q

## 📋 Contesto Progetto

**TrollShortener** è un URL shortener jokeware **STABILE** che forza utenti attraverso step fastidiosi prima del redirect finale.

### 🎯 Stato Attuale (Post-Iterazione 21)
- ✅ **MVP Funzionante** con RNG deterministico stabile
- ✅ **Sistema Sessioni** robusto (cookie + localStorage + DB fallback)
- ✅ **Template System** avanzato con vincoli temporali
- ✅ **Deploy Attivo** su https://tus-tasklink.onrender.com

### 🔥 CRITICI - NON MODIFICARE MAI
1. **RNG Deterministico** in `advanced-template-system.js` - seed DEVE essere deterministico
2. **Logica Step** in `victim.js` - `currentStep >= templates.length` per redirect finale
3. **Sistema Sessioni** in `client-fingerprint.js` - fallback a 3 livelli

## 🎮 Prossimo Obiettivo: Nuovi Click Games

L'utente vuole implementare 3 varianti del click game:

### 1. Teleporting Click Game
- Click button che si sposta nella pagina ad ogni click
- Delay 0.5s mantenuto per prevenire aimbot
- 10% probabilità di spostarsi quando mouse entra nel button
- Utile per far cliccare banner pubblicitari

### 2. Racing Click Game  
- Riempi barra vs svuotamento automatico
- NO delay sui click (gioco di velocità)
- 3 difficoltà con velocità svuotamento diverse
- Solo progress bar visibile, no contatore click

### 3. Rigged Racing Click Game
- Identico al Racing ma truccato
- Impedisce di superare 80%, riporta al 25%
- Timer invisibile 10-40s che deve scadere per vincere
- Timer si ferma 1s dopo ultimo click
- Deve sembrare identico al Racing normale

## 🔧 Modus Operandi da Seguire

### 1. Analisi Prima di Tutto
```bash
# Leggi sempre questi file prima di iniziare
- README.md (stato progetto)
- TECHNICAL_DOCS.md (punti critici)
- backend/utils/advanced-template-system.js (template esistenti)
- backend/templates/minimal-templates.js (HTML template)
```

### 2. Implementazione
- **Aggiungi template** in `advanced-template-system.js`
- **Crea HTML minimale** in `minimal-templates.js`
- **Integra logica** in `victim.js` (generateStepHTML)
- **Testa immediatamente** con script dedicato

### 3. Test e Deploy
```bash
# Crea test per ogni nuovo template
node test-new-click-games.js

# Commit frequenti
git add -A && git commit -m "🎮 Add: [template name]"
git push origin main

# Verifica live
curl https://tus-tasklink.onrender.com
```

## 📊 Template Esistenti (Non Modificare)

### Timer
- `timer_simple`: 15-60s, pause/resume
- `timer_punish`: 20-45s, Windows 95 style

### Click
- `click_simple`: 3-60 click, delay 0.5s
- `click_drain`: 10-60 click, più lento

### Compositi
- `timer_then_click`, `click_then_timer`, `double_timer`

## 🎯 Obiettivi Iterazione

### Priorità 1: Implementare Click Games
1. **Teleporting Click** - Button che si sposta
2. **Racing Click** - Barra vs svuotamento  
3. **Rigged Racing** - Racing truccato con timer

### Priorità 2: Test e Stabilità
- Test per ogni nuovo template
- Verifica integrazione con sistema esistente
- Mantenere performance ottimali

### Priorità 3: Deploy e Verifica
- Commit frequenti con emoji descrittivi
- Test live su Render.com
- Documentazione aggiornata

## ⚠️ Errori da NON Commettere

1. **NON modificare** il seed generation (deve rimanere deterministico)
2. **NON toccare** la logica di redirect finale in victim.js
3. **NON rimuovere** i fallback del sistema sessioni
4. **NON creare** template troppo pesanti (bandwidth limitata)

## 🚀 Risorse Disponibili

- **Deploy Live**: https://tus-tasklink.onrender.com
- **GitHub**: Auto-deploy su push
- **MongoDB Atlas**: Database cloud
- **Test Scripts**: Già pronti per verifica

---

**🎯 OBIETTIVO**: Aggiungere nuovi click games mantenendo stabilità sistema esistente

**⏰ LIMITE**: Max 15-20 iterazioni per istanza

**📋 PROSSIMO STEP**: Leggere TECHNICAL_DOCS.md e iniziare con Teleporting Click Game