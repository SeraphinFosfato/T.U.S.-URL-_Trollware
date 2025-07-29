// Blocchi modulari con sistema puzzle
const modularBlocks = {
  // Timer modulari
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
function generateModularTimerHTML(block, blockSystem) {
  const duration = block.duration;
  const blockId = block.id;
  
  return `
    <style>
      .timer-widget-${blockId} {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        font-family: Arial, sans-serif;
        max-width: ${block.maxWidth || '400px'};
        margin: 0 auto;
      }
      .timer-display-${blockId} {
        font-size: 48px;
        font-weight: bold;
        color: #007bff;
        margin: 15px 0;
      }
      .timer-progress-${blockId} {
        width: 100%;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        margin: 15px 0;
      }
      .timer-fill-${blockId} {
        height: 100%;
        background: #007bff;
        width: 0%;
        transition: width 1s linear;
      }
      .timer-status-${blockId} {
        color: #6c757d;
        margin: 10px 0;
      }
      .continue-btn-${blockId} {
        background: #28a745;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 5px;
        cursor: pointer;
        display: none;
      }
    </style>
    
    <div class="timer-widget-${blockId}">
      <h3>⏱️ Please Wait</h3>
      <div class="timer-display-${blockId}" id="timer-${blockId}">${duration}</div>
      <div class="timer-progress-${blockId}">
        <div class="timer-fill-${blockId}" id="progress-${blockId}"></div>
      </div>
      <div class="timer-status-${blockId}" id="status-${blockId}">Timer in progress...</div>
      <button class="continue-btn-${blockId}" id="continue-${blockId}" 
              data-block-action="complete" data-result="timer_completed">
        Continue
      </button>
    </div>
    
    <script>
      (function() {
        let seconds = ${duration};
        const totalSeconds = ${duration};
        const timerEl = document.getElementById('timer-${blockId}');
        const progressEl = document.getElementById('progress-${blockId}');
        const statusEl = document.getElementById('status-${blockId}');
        const continueBtn = document.getElementById('continue-${blockId}');
        
        const interval = setInterval(() => {
          seconds--;
          timerEl.textContent = seconds;
          
          const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
          progressEl.style.width = progress + '%';
          
          if (seconds <= 0) {
            clearInterval(interval);
            statusEl.textContent = '✅ Timer completed!';
            continueBtn.style.display = 'inline-block';
            timerEl.textContent = '✓';
            timerEl.style.color = '#28a745';
          }
        }, 1000);
      })();
    </script>
  `;
}

function generateModularClickGameHTML(block, blockSystem) {
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
        max-width: ${block.maxWidth || '450px'};
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
      }
      .click-button-${blockId}:hover {
        background: #0056b3;
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
      <button class="click-button-${blockId}" id="clickBtn-${blockId}"
              onclick="handleClick_${blockId}()">
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
            btnEl.textContent = 'Continue';
            btnEl.onclick = function() {
              // Trigger completion via block system
              const event = new CustomEvent('blockComplete', {
                detail: { blockId: '${blockId}', result: 'click_completed' }
              });
              document.dispatchEvent(event);
            };
            progressEl.textContent = '✅ Completed! Click Continue.';
          }
        };
      })();
    </script>
  `;
}

// Estendi BlockSystem con i generatori
if (typeof BlockSystem !== 'undefined') {
  BlockSystem.prototype.generateTimerHTML = generateModularTimerHTML;
  BlockSystem.prototype.generateClickGameHTML = generateModularClickGameHTML;
}

module.exports = { 
  modularBlocks, 
  generateModularTimerHTML, 
  generateModularClickGameHTML 
};