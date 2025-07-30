// Sistema di sessione client-side per ridurre DB usage
const crypto = require('crypto');

class ClientSessionManager {
  constructor() {
    this.secretKey = process.env.SESSION_SECRET || 'troll-secret-key-2024';
  }

  // Genera configurazione sessione criptata
  generateSessionConfig(shortId, totalSteps, expiryDays = 7) {
    const sessionData = {
      shortId,
      totalSteps,
      createdAt: Date.now(),
      expiresAt: Date.now() + (expiryDays * 24 * 60 * 60 * 1000),
      templates: this.generateRandomTemplateSequence(totalSteps)
    };

    return this.encryptSessionData(sessionData);
  }

  // Genera sequenza template randomica
  generateRandomTemplateSequence(steps) {
    const availableTemplates = [
      { type: 'timer', duration: () => 15 + Math.floor(Math.random() * 6) * 5 },
      { type: 'timer_punish', duration: () => 20 + Math.floor(Math.random() * 4) * 5 },
      { type: 'click', target: () => 3 + Math.floor(Math.random() * 5) },
      { type: 'click_drain', target: () => 15 + Math.floor(Math.random() * 10) }
    ];

    const sequence = [];
    for (let i = 0; i < steps; i++) {
      const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      const resolvedTemplate = { ...template };
      
      // Risolvi funzioni dinamiche
      if (typeof template.duration === 'function') {
        resolvedTemplate.duration = template.duration();
      }
      if (typeof template.target === 'function') {
        resolvedTemplate.target = template.target();
      }
      
      sequence.push(resolvedTemplate);
    }
    
    return sequence;
  }

  // Cripta dati sessione
  encryptSessionData(data) {
    const text = JSON.stringify(data);
    const cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decripta dati sessione
  decryptSessionData(encryptedData) {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  // Valida sessione
  validateSession(encryptedData) {
    const sessionData = this.decryptSessionData(encryptedData);
    if (!sessionData) return false;
    
    return Date.now() < sessionData.expiresAt;
  }

  // Genera JavaScript per gestione cookie client-side
  generateClientSessionJS(sessionConfig) {
    return `
      <script>
        // Sistema sessione client-side
        window.TrollSession = {
          config: '${sessionConfig}',
          
          // Salva configurazione in localStorage (più stabile dei cookie)
          save: function() {
            try {
              localStorage.setItem('troll_session', this.config);
              // Backup in cookie per compatibilità
              document.cookie = 'troll_session=' + this.config + '; path=/; max-age=' + (7*24*60*60);
            } catch(e) {
              console.warn('Session storage failed');
            }
          },
          
          // Carica configurazione
          load: function() {
            try {
              return localStorage.getItem('troll_session') || this.getCookie('troll_session');
            } catch(e) {
              return this.getCookie('troll_session');
            }
          },
          
          // Helper cookie
          getCookie: function(name) {
            const value = '; ' + document.cookie;
            const parts = value.split('; ' + name + '=');
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
          },
          
          // Inizializza sessione
          init: function() {
            this.save();
          }
        };
        
        // Auto-inizializza
        window.TrollSession.init();
      </script>
    `;
  }
}

module.exports = new ClientSessionManager();