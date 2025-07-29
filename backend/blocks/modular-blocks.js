// Blocchi modulari con sistema puzzle
const modularBlocks = {
  // Timer modulari
  timer_simple: {
    name: "Loading Timer",
    template: "timer",
    duration: () => 15 + Math.floor(Math.random() * 10) * 5, // 15-60s a blocchi di 5s
    category: "Timer",
    difficulty: "Easy",
    maxWidth: "400px",
    maxHeight: "300px"
  },

  timer_punish: {
    name: "Punitive Timer",
    template: "timer_punish",
    duration: () => 15 + Math.floor(Math.random() * 10) * 5, // 15-60s a blocchi di 5s
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

  // Blocco composito timer+click
  timer_click_combo: {
    name: "Loading Challenge",
    template: "composite",
    category: "Composite",
    difficulty: "Normal",
    maxWidth: "500px",
    maxHeight: "500px",
    timer_duration: () => 15 + Math.floor(Math.random() * 10) * 5,
    click_target: 5
  }
};

// Timer atomico con event system
function generateModularTimerHTML(block, config = {}) {
  const duration = block.duration;
  const blockId = block.id;
  const enabled = config.enabled !== false;
  
  return `
    <div id="${blockId}-container" class="block-container">
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
      </style>
      
      <div class="timer-widget-${blockId}">
        <h2>🔄 Preparing link...</h2>
        <div class="timer-display-${blockId}" id="timer-${blockId}">${duration}</div>
        <div class="timer-progress-${blockId}">
          <div class="timer-fill-${blockId}" id="progress-${blockId}"></div>
        </div>
        <p class="timer-status-${blockId}" id="status-${blockId}">Please wait for completion</p>
        <div class="timer-warning-${blockId}" id="warning-${blockId}">⚠️ Keep this tab active!</div>
        <button class="continue-btn-${blockId}" id="continue-${blockId}" onclick="completeTimer_${blockId}()">
          Continue →
        </button>
      </div>
    </div>
    
    <script>
      (function() {
        let seconds = ${duration};
        let isActive = ${enabled};
        let isPaused = false;
        let timerCompleted = false;
        let timerInterval = null;
        const totalSeconds = ${duration};
        
        const timerEl = document.getElementById('timer-${blockId}');
        const progressEl = document.getElementById('progress-${blockId}');
        const statusEl = document.getElementById('status-${blockId}');
        const warningEl = document.getElementById('warning-${blockId}');
        const continueBtn = document.getElementById('continue-${blockId}');
        
        // Registra blocco nel sistema eventi
        window.BlockEventSystem.registerBlock('${blockId}', {
          enabled: ${enabled},
          nextBlockId: '${config.nextBlockId || ''}',
          nextUrl: '${config.nextUrl || ''}'
        });
        
        function startTimer() {
          if (timerInterval) return;
          
          timerInterval = setInterval(() => {
            if (!isActive || isPaused || timerCompleted) return;
            
            seconds--;
            timerEl.textContent = seconds;
            
            const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
            progressEl.style.width = progress + '%';
            
            if (seconds <= 0) {
              clearInterval(timerInterval);
              timerCompleted = true;
              statusEl.textContent = '✅ Loading completed!';
              continueBtn.style.display = 'inline-block';
              timerEl.textContent = '✓';
              timerEl.style.color = '#28a745';
              warningEl.style.display = 'none';
            }
          }, 1000);
        }
        
        function pauseTimer() {
          isPaused = true;
          warningEl.style.display = 'block';
          statusEl.textContent = 'Timer paused - return to continue';
        }
        
        function resumeTimer() {
          isPaused = false;
          warningEl.style.display = 'none';
          statusEl.textContent = 'Please wait for completion';
        }
        
        // Event listeners
        document.addEventListener('blockEnabled', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isActive = true;
            startTimer();
          }
        });
        
        document.addEventListener('blockDisabled', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isActive = false;
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
          }
        });
        
        document.addEventListener('blockPause', function(e) {
          if (e.detail.blockId === '${blockId}') {
            pauseTimer();
          }
        });
        
        document.addEventListener('blockResume', function(e) {
          if (e.detail.blockId === '${blockId}') {
            resumeTimer();
          }
        });
        
        // Mouse idle detection
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
          if (isPaused && isActive && !timerCompleted) {
            resumeTimer();
          }
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 3000 && isActive && !isPaused && !timerCompleted) {
            pauseTimer();
          }
        }, 1000);
        
        // Complete function
        window.completeTimer_${blockId} = function() {
          if (timerCompleted) {
            window.BlockEventSystem.completeBlock('${blockId}', 'timer_completed');
          }
        };
        
        // Start if enabled
        if (${enabled}) {
          startTimer();
        }
      })();
    </script>
  `;
}

function generateModularClickGameHTML(block, config = {}) {
  const targetClicks = block.target_clicks || 5;
  const blockId = block.id;
  const enabled = config.enabled !== false;
  
  return `
    <div id="${blockId}-container" class="block-container">
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
    </div>
    
    <script>
      (function() {
        let clicks = 0;
        let isActive = ${enabled};
        let clickCompleted = false;
        const target = ${targetClicks};
        
        const progressEl = document.getElementById('progress-${blockId}');
        const btnEl = document.getElementById('clickBtn-${blockId}');
        
        // Registra blocco nel sistema eventi
        window.BlockEventSystem.registerBlock('${blockId}', {
          enabled: ${enabled},
          nextBlockId: '${config.nextBlockId || ''}',
          nextUrl: '${config.nextUrl || ''}'
        });
        
        // Event listeners
        document.addEventListener('blockEnabled', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isActive = true;
          }
        });
        
        document.addEventListener('blockDisabled', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isActive = false;
          }
        });
        
        window.handleClick_${blockId} = function() {
          if (!isActive || clickCompleted) return;
          
          clicks++;
          progressEl.textContent = clicks + '/' + target + ' clicks';
          
          if (clicks >= target) {
            clickCompleted = true;
            btnEl.textContent = 'Continue →';
            btnEl.style.background = '#28a745';
            btnEl.onclick = function() {
              window.BlockEventSystem.completeBlock('${blockId}', 'click_completed');
            };
            progressEl.textContent = '✅ Completed! Click Continue.';
          }
        };
      })();
    </script>
  `;
}

// Timer punitivo atomico con event system
function generateModularPunishTimerHTML(block, config = {}) {
  const duration = block.duration;
  const blockId = block.id;
  const enabled = config.enabled !== false;
  
  return `
    <div id="${blockId}-container" class="block-container">
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
      </style>
      
      <div class="punish-timer-widget-${blockId}">
        <div>Loading in progress...</div>
        <div class="punish-timer-display-${blockId}" id="timer-${blockId}">${duration}</div>
        <div class="punish-progress-${blockId}">
          <div class="punish-fill-${blockId}" id="progress-${blockId}"></div>
        </div>
        <div id="status-${blockId}">Please wait for completion</div>
        <button class="punish-continue-${blockId}" id="continue-${blockId}" onclick="completePunishTimer_${blockId}()">
          Continue
        </button>
      </div>
    </div>
    
    <script>
      (function() {
        let seconds = ${duration};
        let originalDuration = ${duration};
        let isActive = ${enabled};
        let isPaused = false;
        let timerCompleted = false;
        let timerInterval = null;
        
        const timerEl = document.getElementById('timer-${blockId}');
        const statusEl = document.getElementById('status-${blockId}');
        const continueBtn = document.getElementById('continue-${blockId}');
        const progressEl = document.getElementById('progress-${blockId}');
        
        // Registra blocco nel sistema eventi
        window.BlockEventSystem.registerBlock('${blockId}', {
          enabled: ${enabled},
          nextBlockId: '${config.nextBlockId || ''}',
          nextUrl: '${config.nextUrl || ''}'
        });
        
        function showNotification() {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⚠️ Active Waiting Required', {
              body: 'Timer reset due to inactivity.'
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
            
            // Riavvia il timer dopo il reset
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
            
            setTimeout(() => {
              statusEl.textContent = 'Please wait for completion';
              isPaused = false;
              if (isActive) {
                startTimer();
              }
            }, 1000);
          }
        }
        
        function startTimer() {
          if (timerInterval) return;
          
          timerInterval = setInterval(() => {
            if (!isActive || isPaused || timerCompleted) return;
            
            seconds--;
            timerEl.textContent = seconds;
            
            const progress = ((originalDuration - seconds) / originalDuration) * 100;
            progressEl.style.width = progress + '%';
            
            if (seconds <= 0) {
              clearInterval(timerInterval);
              timerCompleted = true;
              statusEl.textContent = 'Completed';
              continueBtn.style.display = 'inline-block';
              continueBtn.className = 'punish-continue-${blockId} enabled';
              timerEl.textContent = 'OK';
              progressEl.style.width = '100%';
            }
          }, 1000);
        }
        
        // Event listeners
        document.addEventListener('blockEnabled', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isActive = true;
            startTimer();
          }
        });
        
        document.addEventListener('blockDisabled', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isActive = false;
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
          }
        });
        
        document.addEventListener('blockPause', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isPaused = true;
            resetTimer();
          }
        });
        
        document.addEventListener('blockResume', function(e) {
          if (e.detail.blockId === '${blockId}') {
            isPaused = false;
          }
        });
        
        // Mouse idle detection - più aggressivo per timer punitivo
        let lastActivity = Date.now();
        document.addEventListener('mousemove', function() {
          lastActivity = Date.now();
        });
        
        setInterval(function() {
          if (Date.now() - lastActivity > 2000 && isActive && !isPaused && !timerCompleted) {
            isPaused = true;
            resetTimer();
          }
        }, 500);
        
        // Complete function
        window.completePunishTimer_${blockId} = function() {
          if (timerCompleted) {
            window.BlockEventSystem.completeBlock('${blockId}', 'punish_timer_completed');
          }
        };
        
        // Start if enabled
        if (${enabled}) {
          startTimer();
        }
      })();
    </script>
  `;
}

// Blocco composito timer+click
function generateModularCompositeHTML(block, nextUrl) {
  const timerDuration = typeof block.timer_duration === 'function' ? block.timer_duration() : block.timer_duration;
  const clickTarget = block.click_target || 5;
  const blockId = block.id;
  
  return `
    <style>
      .composite-widget-${blockId} {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
        font-family: Arial, sans-serif;
      }
      .timer-section-${blockId} {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e0e0e0;
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
      .click-section-${blockId} {
        opacity: 0.3;
        pointer-events: none;
        transition: opacity 0.5s;
      }
      .click-section-${blockId}.enabled {
        opacity: 1;
        pointer-events: auto;
      }
      .click-button-${blockId} {
        background: #28a745;
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
        background: #218838;
        transform: scale(1.05);
      }
      .click-button-${blockId}:active {
        background: #1e7e34;
        transform: scale(0.95);
      }
      .warning-${blockId} {
        color: #dc3545;
        font-weight: bold;
        margin: 10px 0;
        display: none;
      }
    </style>
    
    <div class="composite-widget-${blockId}">
      <h2>🔄 Loading Challenge</h2>
      
      <!-- Timer Section -->
      <div class="timer-section-${blockId}" id="timer-section-${blockId}">
        <h3>Step 1: Wait for loading</h3>
        <div class="timer-display-${blockId}" id="timer-${blockId}">${timerDuration}</div>
        <div class="timer-progress-${blockId}">
          <div class="timer-fill-${blockId}" id="progress-${blockId}"></div>
        </div>
        <p id="timer-status-${blockId}">Please wait for completion</p>
        <div class="warning-${blockId}" id="warning-${blockId}">⚠️ Keep this tab active!</div>
      </div>
      
      <!-- Click Section -->
      <div class="click-section-${blockId}" id="click-section-${blockId}">
        <h3>Step 2: Complete verification</h3>
        <div id="click-progress-${blockId}">0/${clickTarget} clicks</div>
        <button class="click-button-${blockId}" id="click-btn-${blockId}" onclick="handleClick_${blockId}()">
          Click to Verify
        </button>
      </div>
    </div>
    
    <script>
      (function() {
        let timerSeconds = ${timerDuration};
        let clicks = 0;
        let isVisible = true;
        let timerCompleted = false;
        const totalSeconds = ${timerDuration};
        const clickTarget = ${clickTarget};
        
        const timerEl = document.getElementById('timer-${blockId}');
        const progressEl = document.getElementById('progress-${blockId}');
        const timerStatusEl = document.getElementById('timer-status-${blockId}');
        const warningEl = document.getElementById('warning-${blockId}');
        const clickSectionEl = document.getElementById('click-section-${blockId}');
        const clickProgressEl = document.getElementById('click-progress-${blockId}');
        const clickBtnEl = document.getElementById('click-btn-${blockId}');
        
        // Mouse tracking
        let lastMouseMove = Date.now();
        let mouseInWindow = true;
        
        document.addEventListener('mousemove', function() {
          lastMouseMove = Date.now();
          if (!isVisible && !timerCompleted) {
            resumeTimer();
          }
        });
        
        document.addEventListener('mouseenter', function() {
          mouseInWindow = true;
          if (!isVisible && !timerCompleted) {
            resumeTimer();
          }
        });
        
        document.addEventListener('mouseleave', function() {
          mouseInWindow = false;
          if (!timerCompleted) {
            pauseTimer();
          }
        });
        
        function pauseTimer() {
          if (!timerCompleted) {
            isVisible = false;
            warningEl.style.display = 'block';
            timerStatusEl.textContent = 'Timer paused - return to continue';
          }
        }
        
        function resumeTimer() {
          if (!timerCompleted) {
            isVisible = true;
            warningEl.style.display = 'none';
            timerStatusEl.textContent = 'Please wait for completion';
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
        
        // Idle detection - check every second
        setInterval(function() {
          if (Date.now() - lastMouseMove > 3000 && !timerCompleted && isVisible && mouseInWindow) {
            pauseTimer();
          }
        }, 1000);
        
        // Timer countdown
        const timerInterval = setInterval(() => {
          if (!isVisible || document.hidden || !document.hasFocus()) {
            return;
          }
          
          timerSeconds--;
          timerEl.textContent = timerSeconds;
          
          const progress = ((totalSeconds - timerSeconds) / totalSeconds) * 100;
          progressEl.style.width = progress + '%';
          
          if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerCompleted = true;
            timerStatusEl.textContent = '✅ Loading completed!';
            timerEl.textContent = '✓';
            timerEl.style.color = '#28a745';
            warningEl.style.display = 'none';
            
            // Enable click section
            clickSectionEl.classList.add('enabled');
          }
        }, 1000);
        
        // Click handler
        window.handleClick_${blockId} = function() {
          if (!timerCompleted) return;
          
          clicks++;
          clickProgressEl.textContent = clicks + '/' + clickTarget + ' clicks';
          
          if (clicks >= clickTarget) {
            clickBtnEl.textContent = 'Continue →';
            clickBtnEl.style.background = '#007bff';
            clickBtnEl.onclick = function() {
              window.location.href = '${nextUrl}';
            };
            clickProgressEl.textContent = '✅ Verification complete! Click Continue.';
          }
        };
      })();
    </script>
  `;
}

// Genera pagina con blocchi atomici in sequenza
function generateAtomicSequenceHTML(blocks, nextUrl) {
  const { BlockEventSystem } = require('./block-event-system');
  
  let blocksHTML = '';
  let sequenceConfig = [];
  
  // Genera HTML per ogni blocco
  blocks.forEach((blockConfig, index) => {
    const block = modularBlocks[blockConfig.id];
    if (!block) return;
    
    // Risolvi durata dinamica
    const resolvedBlock = { ...block, id: blockConfig.id };
    if (typeof block.duration === 'function') {
      resolvedBlock.duration = block.duration();
    }
    
    // Configura sequenza
    const config = {
      enabled: index === 0, // Solo il primo è abilitato
      nextBlockId: index < blocks.length - 1 ? blocks[index + 1].id : null,
      nextUrl: index === blocks.length - 1 ? nextUrl : null
    };
    
    sequenceConfig.push({ blockId: blockConfig.id, config });
    
    // Genera HTML del blocco
    switch (block.template) {
      case 'timer':
        blocksHTML += generateModularTimerHTML(resolvedBlock, config);
        break;
      case 'click_game':
        blocksHTML += generateModularClickGameHTML(resolvedBlock, config);
        break;
      case 'timer_punish':
        blocksHTML += generateModularPunishTimerHTML(resolvedBlock, config);
        break;
    }
  });
  
  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Loading...</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f0f0;
          margin: 0;
          padding: 20px;
        }
        .block-container {
          margin: 20px 0;
          transition: opacity 0.3s;
        }
      </style>
    </head>
    <body>
      ${BlockEventSystem.generateEventSystemJS()}
      ${blocksHTML}
    </body>
    </html>
  `;
}

module.exports = { 
  modularBlocks, 
  generateModularTimerHTML, 
  generateModularClickGameHTML,
  generateModularPunishTimerHTML,
  generateModularCompositeHTML,
  generateAtomicSequenceHTML
};