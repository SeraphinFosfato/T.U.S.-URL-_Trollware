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
      </style>
    </head>
    <body>
      <div class="timer-container">
        <h2>🔄 Preparazione del link...</h2>
        <div class="timer" id="timer">${duration}</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
        <p>Attendere il completamento del caricamento</p>
      </div>
      
      <script>
        let seconds = ${duration};
        const timerEl = document.getElementById('timer');
        const progressEl = document.getElementById('progress');
        const totalSeconds = ${duration};
        
        const interval = setInterval(() => {
          seconds--;
          timerEl.textContent = seconds;
          
          const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
          progressEl.style.width = progress + '%';
          
          if (seconds <= 0) {
            clearInterval(interval);
            window.location.href = '${nextUrl}';
          }
        }, 1000);
        
        // Anti-bypass: disabilita tasto indietro
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
          history.go(1);
        };
      </script>
    </body>
    </html>
  `;
}

module.exports = { timerBlocks, generateTimerHTML };