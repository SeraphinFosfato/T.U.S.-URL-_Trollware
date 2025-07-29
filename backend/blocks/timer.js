// Blocco Timer - Forza l'utente ad aspettare
const timerBlocks = {
  timer_5s: {
    name: "Timer 5 secondi",
    duration: 5,
    category: "Timer",
    difficulty: "Niente",
    template: "timer"
  },
  timer_15s: {
    name: "Timer 15 secondi", 
    duration: 15,
    category: "Timer",
    difficulty: "Semplice",
    template: "timer"
  },
  timer_30s: {
    name: "Timer 30 secondi",
    duration: 30,
    category: "Timer", 
    difficulty: "Normale",
    template: "timer"
  },
  timer_punish_15s: {
    name: "Timer Punitivo 15s",
    duration: 15,
    category: "Timer",
    difficulty: "Impegnativo",
    template: "timer_punish"
  },
  timer_punish_30s: {
    name: "Timer Punitivo 30s",
    duration: 30,
    category: "Timer",
    difficulty: "Difficile",
    template: "timer_punish"
  }
};

function generateTimerHTML(blockId, duration, nextUrl) {
  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Caricamento...</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px;
          background: #f0f0f0;
        }
        .timer-container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 400px;
          margin: 0 auto;
        }
        .timer { 
          font-size: 48px; 
          color: #007bff; 
          font-weight: bold;
          margin: 20px 0;
        }
        .progress-bar {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 20px 0;
        }
        .progress-fill {
          height: 100%;
          background: #007bff;
          width: 0%;
          transition: width 1s linear;
        }
        .continue-btn {
          padding: 15px 30px;
          font-size: 18px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
          display: none;
        }
        .continue-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        .warning {
          color: #dc3545;
          font-weight: bold;
          margin-top: 10px;
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="timer-container">
        <h2>🔄 Preparazione del link...</h2>
        <div class="timer" id="timer">${duration}</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
        <p id="status">Attendere il completamento del caricamento</p>
        <div class="warning" id="warning">⚠️ Mantieni questa scheda attiva per continuare!</div>
        <button class="continue-btn" id="continueBtn" onclick="proceedNext()" disabled>
          Continua →
        </button>
      </div>
      
      <script>
        let seconds = ${duration};
        let isVisible = true;
        let timerCompleted = false;
        const timerEl = document.getElementById('timer');
        const progressEl = document.getElementById('progress');
        const statusEl = document.getElementById('status');
        const warningEl = document.getElementById('warning');
        const continueBtn = document.getElementById('continueBtn');
        const totalSeconds = ${duration};
        
        // Multiple visibility detection methods
        function pauseTimer() {
          if (!timerCompleted) {
            isVisible = false;
            warningEl.style.display = 'block';
            statusEl.textContent = 'Timer in pausa - torna alla scheda per continuare';
          }
        }
        
        function resumeTimer() {
          if (!timerCompleted) {
            isVisible = true;
            warningEl.style.display = 'none';
            statusEl.textContent = 'Attendere il completamento del caricamento';
          }
        }
        
        // Visibility API
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            pauseTimer();
          } else {
            resumeTimer();
          }
        });
        
        // Window focus/blur
        window.addEventListener('blur', pauseTimer);
        window.addEventListener('focus', resumeTimer);
        
        // Page hide/show
        window.addEventListener('pagehide', pauseTimer);
        window.addEventListener('pageshow', resumeTimer);
        
        // Mouse leave/enter (per tab switching)
        document.addEventListener('mouseleave', function() {
          setTimeout(pauseTimer, 100); // Piccolo delay per evitare falsi positivi
        });
        
        // Heartbeat check - se l'utente non muove il mouse per 3 secondi, pausa
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
          if (!isVisible && !timerCompleted) {
            resumeTimer();
          }
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 3000 && !timerCompleted) {
            pauseTimer();
          }
        }, 1000);
        
        const interval = setInterval(() => {
          // Controlli multipli per visibilità
          if (!isVisible || document.hidden || !document.hasFocus()) {
            return; // Pausa il timer se non visibile
          }
          
          seconds--;
          timerEl.textContent = seconds;
          
          const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
          progressEl.style.width = progress + '%';
          
          if (seconds <= 0) {
            clearInterval(interval);
            timerCompleted = true;
            statusEl.textContent = '✅ Caricamento completato!';
            continueBtn.style.display = 'inline-block';
            continueBtn.disabled = false;
            timerEl.textContent = '✓';
            timerEl.style.color = '#28a745';
          }
        }, 1000);
        
        function proceedNext() {
          if (timerCompleted) {
            window.location.href = '${nextUrl}';
          }
        }
        
        // Anti-bypass: disabilita tasto indietro
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
          history.go(1);
        };
        
        // Anti-bypass: blocca F5, Ctrl+R, etc
        document.addEventListener('keydown', function(e) {
          if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            return false;
          }
        });
      </script>
    </body>
    </html>
  `;
}

function generatePunishTimerHTML(blockId, duration, nextUrl) {
  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>⚠️ ATTENZIONE RICHIESTA</title>
      <style>
        body { 
          font-family: 'Courier New', monospace; 
          text-align: center; 
          padding: 20px;
          background: linear-gradient(45deg, #ff0000, #ff6600);
          color: white;
          animation: flash 2s infinite;
        }
        @keyframes flash {
          0%, 50% { background: linear-gradient(45deg, #ff0000, #ff6600); }
          25%, 75% { background: linear-gradient(45deg, #cc0000, #cc4400); }
        }
        .punish-container {
          background: rgba(0,0,0,0.8);
          padding: 30px;
          border: 3px solid #ff0000;
          border-radius: 0;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 0 20px #ff0000;
        }
        .timer { 
          font-size: 64px; 
          color: #ff0000; 
          font-weight: bold;
          margin: 20px 0;
          text-shadow: 2px 2px 4px #000;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .warning-text {
          font-size: 18px;
          color: #ffff00;
          font-weight: bold;
          margin: 15px 0;
          text-transform: uppercase;
        }
        .reset-warning {
          background: #ff0000;
          color: white;
          padding: 10px;
          margin: 20px 0;
          border: 2px solid #ffffff;
          font-weight: bold;
        }
        .continue-btn {
          padding: 20px 40px;
          font-size: 20px;
          background: #ff0000;
          color: white;
          border: 3px solid #ffffff;
          cursor: pointer;
          margin-top: 20px;
          display: none;
          text-transform: uppercase;
          font-weight: bold;
        }
        .continue-btn:disabled {
          background: #666;
          cursor: not-allowed;
        }
        .reset-count {
          color: #ff6600;
          font-size: 16px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="punish-container">
        <h1>⚠️ TIMER PUNITIVO ⚠️</h1>
        <div class="warning-text">ATTENZIONE COSTANTE RICHIESTA</div>
        <div class="timer" id="timer">${duration}</div>
        <div class="reset-warning">
          🚨 NON CAMBIARE SCHEDA O IL TIMER SI RESETTERÀ 🚨
        </div>
        <p id="status">Mantieni il focus su questa pagina</p>
        <div class="reset-count" id="resetCount">Reset subiti: <span id="resets">0</span></div>
        <button class="continue-btn" id="continueBtn" onclick="proceedNext()" disabled>
          PROCEDI →
        </button>
      </div>
      
      <script>
        let seconds = ${duration};
        let originalDuration = ${duration};
        let isVisible = true;
        let timerCompleted = false;
        let resetCount = 0;
        const timerEl = document.getElementById('timer');
        const statusEl = document.getElementById('status');
        const continueBtn = document.getElementById('continueBtn');
        const resetCountEl = document.getElementById('resets');
        
        // Notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
        
        function showNotification() {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⚠️ ATTENZIONE RICHIESTA', {
              body: 'Torna alla scheda o il timer si resetterà!',
              icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚠️</text></svg>',
              requireInteraction: true
            });
          }
        }
        
        function resetTimer() {
          if (!timerCompleted) {
            resetCount++;
            resetCountEl.textContent = resetCount;
            seconds = originalDuration;
            statusEl.textContent = '🚨 TIMER RESETTATO! Mantieni il focus!';
            statusEl.style.color = '#ff0000';
            showNotification();
            
            // Flash effect
            document.body.style.animation = 'flash 0.5s 3';
            setTimeout(() => {
              statusEl.textContent = 'Mantieni il focus su questa pagina';
              statusEl.style.color = 'white';
            }, 2000);
          }
        }
        
        function pauseTimer() {
          if (!timerCompleted) {
            isVisible = false;
            resetTimer();
          }
        }
        
        function resumeTimer() {
          if (!timerCompleted) {
            isVisible = true;
          }
        }
        
        // Multiple detection methods
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            pauseTimer();
          } else {
            resumeTimer();
          }
        });
        
        window.addEventListener('blur', pauseTimer);
        window.addEventListener('focus', resumeTimer);
        window.addEventListener('pagehide', pauseTimer);
        window.addEventListener('pageshow', resumeTimer);
        
        // Heartbeat più aggressivo
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
          if (!isVisible && !timerCompleted) {
            resumeTimer();
          }
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 2000 && !timerCompleted) {
            pauseTimer();
          }
        }, 500);
        
        const interval = setInterval(() => {
          if (!isVisible || document.hidden || !document.hasFocus()) {
            return;
          }
          
          seconds--;
          timerEl.textContent = seconds;
          
          if (seconds <= 0) {
            clearInterval(interval);
            timerCompleted = true;
            statusEl.textContent = '✅ COMPLETATO! Puoi procedere.';
            statusEl.style.color = '#00ff00';
            continueBtn.style.display = 'inline-block';
            continueBtn.disabled = false;
            timerEl.textContent = '✓';
            timerEl.style.color = '#00ff00';
            document.body.style.animation = 'none';
            document.body.style.background = '#004400';
          }
        }, 1000);
        
        function proceedNext() {
          if (timerCompleted) {
            window.location.href = '${nextUrl}';
          }
        }
        
        // Anti-bypass
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
          history.go(1);
        };
        
        document.addEventListener('keydown', function(e) {
          if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            return false;
          }
        });
        
        // Show initial notification
        setTimeout(showNotification, 1000);
      </script>
    </body>
    </html>
  `;
}

module.exports = { timerBlocks, generateTimerHTML, generatePunishTimerHTML };