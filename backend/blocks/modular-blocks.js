// Blocchi modulari con sistema puzzle
const modularBlocks = {
  // Timer modulari
  timer_simple: {
    name: "Simple Timer",
    template: "timer",
    duration: 5,
    category: "Timer",
    difficulty: "Easy",
    maxWidth: "400px",
    maxHeight: "300px"
  },
  
  timer_5s: {
    name: "Timer 5 seconds",
    template: "timer",
    duration: 5,
    category: "Timer",
    difficulty: "Easy",
    maxWidth: "400px",
    maxHeight: "300px"
  },

  timer_15s: {
    name: "Timer 15 seconds", 
    template: "timer",
    duration: 15,
    category: "Timer",
    difficulty: "Normal",
    maxWidth: "400px",
    maxHeight: "300px"
  },

  timer_punish_15s: {
    name: "Punitive Timer 15s",
    template: "timer_punish",
    duration: 15,
    category: "Timer",
    difficulty: "Hard",
    maxWidth: "400px",
    maxHeight: "350px"
  },

  // Click games modulari
  click_simple: {
    name: "Simple Click Game",
    template: "click_game",
    target_clicks: 5,
    category: "Minigame",
    difficulty: "Easy",
    maxWidth: "450px",
    maxHeight: "250px"
  },

  click_drain: {
    name: "Drain Bar Click",
    template: "click_drain",
    target_clicks: 20,
    drain_speed: 3,
    category: "Minigame", 
    difficulty: "Frustrating",
    maxWidth: "450px",
    maxHeight: "300px"
  },

  // Blocchi compositi (nesting)
  protected_click: {
    name: "Timer Protected Click",
    template: "composite",
    category: "Composite",
    difficulty: "Protected",
    maxWidth: "500px",
    maxHeight: "400px",
    composition: {
      timer_protection: {
        blockType: "timer_5s",
        position: "top",
        onComplete: ["enable_click_game"]
      },
      click_game: {
        blockType: "click_simple", 
        position: "bottom",
        enabled: false,
        onComplete: [{ type: "callback", callback: "completeComposite" }]
      }
    }
  }
};

// Generatori HTML modulari
function generateModularTimerHTML(block, nextUrl) {
  const duration = block.duration;
  const blockId = block.id;
  
  return `
    <style>
      .timer-widget-${blockId} {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 400px;
        margin: 0 auto;
        text-align: center;
        font-family: Arial, sans-serif;
      }
      .timer-display-${blockId} {
        font-size: 48px;
        color: #007bff;
        font-weight: bold;
        margin: 20px 0;
      }
      .timer-progress-${blockId} {
        width: 100%;
        height: 20px;
        background: #e0e0e0;
        border-radius: 10px;
        overflow: hidden;
        margin: 20px 0;
      }
      .timer-fill-${blockId} {
        height: 100%;
        background: #007bff;
        width: 0%;
        transition: width 1s linear;
      }
      .timer-status-${blockId} {
        margin: 10px 0;
        color: #666;
      }
      .timer-warning-${blockId} {
        color: #dc3545;
        font-weight: bold;
        margin-top: 10px;
        display: none;
      }
      .continue-btn-${blockId} {
        padding: 15px 30px;
        font-size: 18px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
        display: none;
        transition: background 0.2s;
      }
      .continue-btn-${blockId}:hover {
        background: #218838;
      }
      .continue-btn-${blockId}:active {
        background: #1e7e34;
        transform: translateY(1px);
      }
    </style>
    
    <div class="timer-widget-${blockId}">
      <h2>🔄 Preparing link...</h2>
      <div class="timer-display-${blockId}" id="timer-${blockId}">${duration}</div>
      <div class="timer-progress-${blockId}">
        <div class="timer-fill-${blockId}" id="progress-${blockId}"></div>
      </div>
      <p class="timer-status-${blockId}" id="status-${blockId}">Please wait for completion</p>
      <div class="timer-warning-${blockId}" id="warning-${blockId}">⚠️ Keep this tab active to continue!</div>
      <button class="continue-btn-${blockId}" id="continue-${blockId}" onclick="proceedNext_${blockId}()">
        Continua →
      </button>
    </div>
    
    <script>
      (function() {
        let seconds = ${duration};
        let isVisible = true;
        let timerCompleted = false;
        const totalSeconds = ${duration};
        const timerEl = document.getElementById('timer-${blockId}');
        const progressEl = document.getElementById('progress-${blockId}');
        const statusEl = document.getElementById('status-${blockId}');
        const warningEl = document.getElementById('warning-${blockId}');
        const continueBtn = document.getElementById('continue-${blockId}');
        
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
        
        // Visibility detection
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            pauseTimer();
          } else {
            resumeTimer();
          }
        });
        
        window.addEventListener('blur', pauseTimer);
        window.addEventListener('focus', resumeTimer);
        
        // Idle detection
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
          if (!isVisible && !timerCompleted) {
            resumeTimer();
          }
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 3000 && !timerCompleted && isVisible) {
            pauseTimer();
          }
        }, 1000);
        
        const interval = setInterval(() => {
          if (!isVisible || document.hidden || !document.hasFocus()) {
            return;
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
            timerEl.textContent = '✓';
            timerEl.style.color = '#28a745';
            warningEl.style.display = 'none';
          }
        }, 1000);
        
        window.proceedNext_${blockId} = function() {
          if (timerCompleted) {
            window.location.href = '${nextUrl}';
          }
        };
      })();
    </script>
  `;
}

function generateModularClickGameHTML(block, nextUrl) {
  const targetClicks = block.target_clicks || 5;
  const blockId = block.id;
  
  return `
    <style>
      .click-widget-${blockId} {
        background: #ffffff;
        border: 2px solid #007bff;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        font-family: Arial, sans-serif;
        max-width: 450px;
        margin: 0 auto;
      }
      .click-button-${blockId} {
        background: #007bff;
        color: white;
        border: none;
        padding: 15px 30px;
        font-size: 18px;
        border-radius: 5px;
        cursor: pointer;
        margin: 15px;
        transition: all 0.2s;
      }
      .click-button-${blockId}:hover {
        background: #0056b3;
        transform: scale(1.05);
      }
      .click-button-${blockId}:active {
        background: #004085;
        transform: scale(0.95);
      }
      .click-progress-${blockId} {
        font-size: 16px;
        margin: 15px 0;
        color: #495057;
      }
    </style>
    
    <div class="click-widget-${blockId}">
      <h3>🎯 Click Challenge</h3>
      <div class="click-progress-${blockId}" id="progress-${blockId}">
        0/${targetClicks} clicks
      </div>
      <button class="click-button-${blockId}" id="clickBtn-${blockId}" onclick="handleClick_${blockId}()">
        Click Here
      </button>
    </div>
    
    <script>
      (function() {
        let clicks = 0;
        const target = ${targetClicks};
        
        window.handleClick_${blockId} = function() {
          clicks++;
          const progressEl = document.getElementById('progress-${blockId}');
          const btnEl = document.getElementById('clickBtn-${blockId}');
          
          progressEl.textContent = clicks + '/' + target + ' clicks';
          
          if (clicks >= target) {
            btnEl.textContent = 'Continue →';
            btnEl.style.background = '#28a745';
            btnEl.onclick = function() {
              window.location.href = '${nextUrl}';
            };
            progressEl.textContent = '✅ Completed! Click Continue.';
          }
        };
      })();
    </script>
  `;
}

// Timer punitivo modulare
function generateModularPunishTimerHTML(block, nextUrl) {
  const duration = block.duration;
  const blockId = block.id;
  
  return `
    <style>
      .punish-timer-widget-${blockId} {
        background: #c0c0c0;
        border: 2px outset #c0c0c0;
        padding: 15px;
        width: 300px;
        margin: 0 auto;
        font-family: 'MS Sans Serif', sans-serif;
        font-size: 11px;
      }
      .punish-timer-display-${blockId} {
        font-family: 'Courier New', monospace;
        font-size: 24px;
        color: #000080;
        margin: 10px 0;
        text-align: center;
        background: #ffffff;
        border: 1px inset #c0c0c0;
        padding: 5px;
      }
      .punish-progress-${blockId} {
        width: 100%;
        height: 20px;
        background: #ffffff;
        border: 1px inset #c0c0c0;
        margin: 10px 0;
      }
      .punish-fill-${blockId} {
        height: 100%;
        background: #000080;
        width: 0%;
      }
      .punish-continue-${blockId} {
        background: #c0c0c0;
        border: 1px outset #c0c0c0;
        padding: 2px 8px;
        font-size: 11px;
        color: #808080;
        cursor: default;
        margin-top: 10px;
        display: none;
      }
      .punish-continue-${blockId}.enabled {
        color: #000000;
        cursor: pointer;
      }
      .punish-continue-${blockId}.enabled:hover {
        background: #d4d4d4;
      }
      .punish-continue-${blockId}.enabled:active {
        border: 1px inset #c0c0c0;
        background: #b0b0b0;
      }
    </style>
    
    <div class="punish-timer-widget-${blockId}">
      <div>Loading in progress...</div>
      <div class="punish-timer-display-${blockId}" id="timer-${blockId}">${duration}</div>
      <div class="punish-progress-${blockId}">
        <div class="punish-fill-${blockId}" id="progress-${blockId}"></div>
      </div>
      <div id="status-${blockId}">Please wait for completion</div>
      <button class="punish-continue-${blockId}" id="continue-${blockId}" onclick="proceedNext_${blockId}()">
        Continue
      </button>
    </div>
    
    <script>
      (function() {
        let seconds = ${duration};
        let originalDuration = ${duration};
        let isVisible = true;
        let timerCompleted = false;
        const timerEl = document.getElementById('timer-${blockId}');
        const statusEl = document.getElementById('status-${blockId}');
        const continueBtn = document.getElementById('continue-${blockId}');
        const progressEl = document.getElementById('progress-${blockId}');
        
        function showNotification() {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⚠️ Active Waiting Required', {
              body: 'You must remain actively waiting. Timer reset.'
            });
          }
        }
        
        function resetTimer() {
          if (!timerCompleted) {
            showNotification();
            seconds = originalDuration;
            timerEl.textContent = seconds;
            progressEl.style.width = '0%';
            statusEl.textContent = 'Timer reset - keep focus!';
            setTimeout(() => {
              statusEl.textContent = 'Please wait for completion';
            }, 2000);
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
        
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            pauseTimer();
          } else {
            resumeTimer();
          }
        });
        
        window.addEventListener('blur', pauseTimer);
        window.addEventListener('focus', resumeTimer);
        
        // Idle detection
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 2000 && !timerCompleted && isVisible) {
            pauseTimer();
          }
        }, 500);
        
        const interval = setInterval(() => {
          if (!isVisible || document.hidden) {
            return;
          }
          
          seconds--;
          timerEl.textContent = seconds;
          
          const progress = ((originalDuration - seconds) / originalDuration) * 100;
          progressEl.style.width = progress + '%';
          
          if (seconds <= 0) {
            clearInterval(interval);
            timerCompleted = true;
            statusEl.textContent = 'Completed';
            continueBtn.style.display = 'inline-block';
            continueBtn.className = 'punish-continue-${blockId} enabled';
            timerEl.textContent = 'OK';
            progressEl.style.width = '100%';
          }
        }, 1000);
        
        window.proceedNext_${blockId} = function() {
          if (timerCompleted) {
            window.location.href = '${nextUrl}';
          }
        };
      })();
    </script>
  `;
}

module.exports = { 
  modularBlocks, 
  generateModularTimerHTML, 
  generateModularClickGameHTML,
  generateModularPunishTimerHTML 
};