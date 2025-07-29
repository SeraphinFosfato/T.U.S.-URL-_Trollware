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

module.exports = { timerBlocks, generateTimerHTML };