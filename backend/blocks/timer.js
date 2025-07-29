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
        <h2>🔄 Preparing link...</h2>
        <div class="timer" id="timer">${duration}</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
        <p id="status">Please wait for completion</p>
        <div class="warning" id="warning">⚠️ Keep this tab active to continue!</div>
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
            statusEl.textContent = 'Timer paused - return to tab to continue';
          }
        }
        
        function resumeTimer() {
          if (!timerCompleted) {
            isVisible = true;
            warningEl.style.display = 'none';
            statusEl.textContent = 'Please wait for completion';
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
            statusEl.textContent = '✅ Loading completed!';
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
      <title>Caricamento...</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .loading-widget {
          background: #c0c0c0;
          border: 2px outset #c0c0c0;
          padding: 15px;
          width: 300px;
          margin: 50px auto;
          font-size: 11px;
        }
        .timer-display { 
          font-family: 'Courier New', monospace;
          font-size: 24px; 
          color: #000080;
          font-weight: normal;
          margin: 10px 0;
          text-align: center;
          background: #ffffff;
          border: 1px inset #c0c0c0;
          padding: 5px;
        }
        .progress-bar {
          width: 100%;
          height: 20px;
          background: #ffffff;
          border: 1px inset #c0c0c0;
          margin: 10px 0;
        }
        .progress-fill {
          height: 100%;
          background: #000080;
          width: 0%;
        }
        .status-text {
          color: #000000;
          font-size: 11px;
          margin: 5px 0;
        }
        .continue-btn {
          background: #c0c0c0;
          border: 1px outset #c0c0c0;
          padding: 2px 8px;
          font-size: 11px;
          color: #808080;
          cursor: default;
          margin-top: 10px;
        }
        .continue-btn.enabled {
          color: #000000;
          cursor: pointer;
        }
        .continue-btn.enabled:hover {
          background: #d4d4d4;
        }
        .continue-btn.enabled:active {
          border: 1px inset #c0c0c0;
          background: #b0b0b0;
        }
      </style>
    </head>
    <body>
      <div class="loading-widget">
        <div class="status-text">Loading in progress...</div>
        <div class="timer-display" id="timer">${duration}</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
        <div class="status-text" id="status">Please wait for completion</div>
        <button class="continue-btn" id="continueBtn" onclick="proceedNext()" style="display: none;">
          Continue
        </button>
      </div>
      
      <script>
        let seconds = ${duration};
        let originalDuration = ${duration};
        let isVisible = true;
        let timerCompleted = false;
        let hasBeenIdle = false;
        const timerEl = document.getElementById('timer');
        const statusEl = document.getElementById('status');
        const continueBtn = document.getElementById('continueBtn');
        const progressEl = document.getElementById('progress');
        
        // Notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
        
        function showNotification() {
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('⚠️ Active Waiting Required', {
                body: 'You must remain actively waiting. Page reloaded.',
                requireInteraction: false
              });
            } else if (Notification.permission === 'default') {
              Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                  showNotification();
                }
              });
            }
          }
        }
        
        function reloadPage() {
          showNotification();
          setTimeout(() => window.location.reload(), 500);
        }
        
        function resetTimer() {
          if (!timerCompleted) {
            reloadPage();
          }
        }
        
        function pauseTimer() {
          if (!timerCompleted && isVisible) {
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
        
        // Heartbeat per idle detection
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
          hasBeenIdle = false;
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 2000 && !timerCompleted && !hasBeenIdle && isVisible) {
            hasBeenIdle = true;
            pauseTimer();
          }
        }, 500);
        
        const interval = setInterval(() => {
          if (!isVisible || document.hidden || !document.hasFocus()) {
            return;
          }
          
          seconds--;
          timerEl.textContent = seconds;
          
          // Barra a blocchi (aggiorna ogni secondo)
          const progress = ((originalDuration - seconds) / originalDuration) * 100;
          progressEl.style.width = progress + '%';
          
          if (seconds <= 0) {
            clearInterval(interval);
            timerCompleted = true;
            statusEl.textContent = 'Completed';
            continueBtn.style.display = 'inline-block';
            continueBtn.disabled = false;
            continueBtn.className = 'continue-btn enabled';
            timerEl.textContent = 'OK';
            progressEl.style.width = '100%';
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
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      </script>
    </body>
    </html>
  `;
}

module.exports = { timerBlocks, generateTimerHTML, generatePunishTimerHTML };