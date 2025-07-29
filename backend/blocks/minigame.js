// Minigame Blocks - Click loops e decoy games
const minigameBlocks = {
  click_decoy_popup: {
    name: "Click Decoy with Popups",
    target_clicks: 5,
    category: "Minigame",
    difficulty: "Annoying",
    template: "click_decoy"
  },
  
  click_drain_bar: {
    name: "Click Drain Bar",
    target_clicks: 20,
    drain_speed: 3, // clicks per second drained
    category: "Minigame", 
    difficulty: "Frustrating",
    template: "click_drain"
  },

  click_protected: {
    name: "Timer Protected Click Game",
    timer_duration: 10,
    target_clicks: 8,
    category: "Minigame",
    difficulty: "Protected",
    template: "click_protected"
  }
};

function generateClickDecoyHTML(blockId, targetClicks, nextUrl) {
  return `
    <div class="game-widget">
      <style>
        .game-widget {
          background: #ffffff;
          border: 2px solid #cccccc;
          padding: 20px;
          width: 400px;
          margin: 0 auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .game-title {
          font-size: 16px;
          margin-bottom: 15px;
          color: #333;
        }
        .click-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          cursor: pointer;
          border-radius: 5px;
          margin: 10px;
        }
        .click-button:hover {
          background: #0056b3;
        }
        .progress-text {
          margin: 15px 0;
          font-size: 14px;
          color: #666;
        }
        .decoy-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          border: 2px solid #000;
          padding: 20px;
          z-index: 9999;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: none;
        }
      </style>
      
      <div class="game-title">Click to Continue</div>
      <div class="progress-text" id="progress">Click the button ${targetClicks} times</div>
      <button class="click-button" id="mainButton" onclick="handleClick()">
        Click Here
      </button>
      
      <!-- Decoy popups -->
      <div class="decoy-popup" id="popup1">
        <h3>🎉 Congratulations!</h3>
        <p>You've won a prize! Click to claim:</p>
        <button onclick="closeDecoy('popup1')">Claim Prize</button>
      </div>
      
      <div class="decoy-popup" id="popup2">
        <h3>⚠️ Security Alert</h3>
        <p>Your system needs updating. Click to fix:</p>
        <button onclick="closeDecoy('popup2')">Update Now</button>
      </div>
      
      <script>
        let clicks = 0;
        let targetClicks = ${targetClicks};
        let decoyShown = false;
        
        function handleClick() {
          clicks++;
          document.getElementById('progress').textContent = 
            \`\${clicks}/\${targetClicks} clicks completed\`;
          
          // Show decoy popup after 2 clicks
          if (clicks === 2 && !decoyShown) {
            showDecoyPopup();
            decoyShown = true;
          }
          
          if (clicks >= targetClicks) {
            document.getElementById('mainButton').textContent = 'Continue';
            document.getElementById('mainButton').onclick = function() {
              window.location.href = '${nextUrl}';
            };
            document.getElementById('progress').textContent = '✅ Completed! Click Continue.';
          }
        }
        
        function showDecoyPopup() {
          const popup = Math.random() > 0.5 ? 'popup1' : 'popup2';
          document.getElementById(popup).style.display = 'block';
        }
        
        function closeDecoy(popupId) {
          document.getElementById(popupId).style.display = 'none';
          // Show another decoy after closing
          setTimeout(() => {
            const otherPopup = popupId === 'popup1' ? 'popup2' : 'popup1';
            document.getElementById(otherPopup).style.display = 'block';
          }, 3000);
        }
      </script>
    </div>
  `;
}

function generateClickDrainHTML(blockId, targetClicks, drainSpeed, nextUrl) {
  return `
    <div class="game-widget">
      <style>
        .game-widget {
          background: #ffffff;
          border: 2px solid #cccccc;
          padding: 20px;
          width: 400px;
          margin: 0 auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .drain-bar {
          width: 100%;
          height: 30px;
          background: #e0e0e0;
          border: 1px solid #ccc;
          margin: 15px 0;
          position: relative;
        }
        .drain-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff4444, #ff8888);
          width: 0%;
          transition: width 0.1s;
        }
        .click-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          cursor: pointer;
          border-radius: 5px;
        }
        .warning-text {
          color: #dc3545;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
      
      <div class="game-title">Fill the Progress Bar</div>
      <div class="drain-bar">
        <div class="drain-fill" id="progressBar"></div>
      </div>
      <div class="progress-text" id="progress">0/${targetClicks} clicks</div>
      <button class="click-button" id="clickBtn" onclick="addProgress()">
        Click to Fill
      </button>
      <div class="warning-text">⚠️ Bar drains over time - click fast!</div>
      
      <script>
        let currentProgress = 0;
        let targetClicks = ${targetClicks};
        let drainSpeed = ${drainSpeed};
        let gameCompleted = false;
        
        // Drain progress over time
        setInterval(() => {
          if (!gameCompleted && currentProgress > 0) {
            currentProgress = Math.max(0, currentProgress - (drainSpeed / 10));
            updateDisplay();
          }
        }, 100);
        
        function addProgress() {
          if (gameCompleted) {
            window.location.href = '${nextUrl}';
            return;
          }
          
          currentProgress = Math.min(targetClicks, currentProgress + 1);
          updateDisplay();
          
          if (currentProgress >= targetClicks) {
            gameCompleted = true;
            document.getElementById('clickBtn').textContent = 'Continue';
            document.getElementById('progress').textContent = '✅ Completed!';
          }
        }
        
        function updateDisplay() {
          const percentage = (currentProgress / targetClicks) * 100;
          document.getElementById('progressBar').style.width = percentage + '%';
          document.getElementById('progress').textContent = 
            \`\${Math.floor(currentProgress)}/\${targetClicks} clicks\`;
        }
      </script>
    </div>
  `;
}

function generateClickProtectedHTML(blockId, timerDuration, targetClicks, nextUrl) {
  return `
    <div class="game-widget">
      <style>
        .game-widget {
          background: #ffffff;
          border: 2px solid #cccccc;
          padding: 20px;
          width: 400px;
          margin: 0 auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .timer-protection {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .timer-display {
          font-size: 24px;
          font-weight: bold;
          color: #856404;
          margin: 10px 0;
        }
        .click-area {
          opacity: 0.3;
          pointer-events: none;
          transition: opacity 0.5s;
        }
        .click-area.enabled {
          opacity: 1;
          pointer-events: auto;
        }
        .click-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          cursor: pointer;
          border-radius: 5px;
        }
      </style>
      
      <div class="timer-protection">
        <div>🔒 Security Timer Active</div>
        <div class="timer-display" id="timer">${timerDuration}</div>
        <div>Please wait before clicking...</div>
      </div>
      
      <div class="click-area" id="clickArea">
        <div class="game-title">Click Game Unlocked</div>
        <div class="progress-text" id="progress">0/${targetClicks} clicks needed</div>
        <button class="click-button" id="clickBtn" onclick="handleClick()">
          Click Here
        </button>
      </div>
      
      <script>
        let timerSeconds = ${timerDuration};
        let clicks = 0;
        let targetClicks = ${targetClicks};
        let timerCompleted = false;
        
        // Timer countdown
        const timerInterval = setInterval(() => {
          timerSeconds--;
          document.getElementById('timer').textContent = timerSeconds;
          
          if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerCompleted = true;
            document.querySelector('.timer-protection').style.display = 'none';
            document.getElementById('clickArea').classList.add('enabled');
          }
        }, 1000);
        
        function handleClick() {
          if (!timerCompleted) return;
          
          clicks++;
          document.getElementById('progress').textContent = 
            \`\${clicks}/\${targetClicks} clicks completed\`;
          
          if (clicks >= targetClicks) {
            document.getElementById('clickBtn').textContent = 'Continue';
            document.getElementById('clickBtn').onclick = function() {
              window.location.href = '${nextUrl}';
            };
            document.getElementById('progress').textContent = '✅ Game completed!';
          }
        }
      </script>
    </div>
  `;
}

module.exports = { 
  minigameBlocks, 
  generateClickDecoyHTML, 
  generateClickDrainHTML,
  generateClickProtectedHTML 
};