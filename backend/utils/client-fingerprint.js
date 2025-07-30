// Sistema di fingerprinting e hashing per tracciamento client
const crypto = require('crypto');

class ClientFingerprintManager {
  constructor() {
    this.secretKey = process.env.FINGERPRINT_SECRET || 'troll-fingerprint-2024';
  }

  // Genera fingerprint da headers e IP
  generateFingerprint(req) {
    const logger = require('./debug-logger');
    
    const components = [
      req.ip || req.connection.remoteAddress,
      req.headers['user-agent'] || '',
      req.headers['accept-language'] || '',
      req.headers['accept-encoding'] || '',
      // Aggiungi timestamp per evitare collisioni bot
      Math.floor(Date.now() / (1000 * 60 * 10)) // 10min window
    ];
    
    const rawFingerprint = components.join('|');
    const fingerprint = crypto.createHash('sha256').update(rawFingerprint + this.secretKey).digest('hex').substring(0, 16);
    
    logger.fingerprint('GENERATED', fingerprint, {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
      timestamp: Math.floor(Date.now() / (1000 * 60 * 10))
    });
    
    return fingerprint;
  }

  // Genera hash percorso per shortId + fingerprint
  generatePathHash(shortId, fingerprint) {
    const pathData = `${shortId}:${fingerprint}:${Date.now()}`;
    return crypto.createHash('md5').update(pathData + this.secretKey).digest('hex').substring(0, 12);
  }

  // Genera percorso client specifico
  generateClientPath(shortId, fingerprint, totalSteps, expiryDays = 7) {
    const pathHash = this.generatePathHash(shortId, fingerprint);
    
    const pathData = {
      pathHash,
      shortId,
      fingerprint,
      totalSteps,
      currentStep: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + (expiryDays * 24 * 60 * 60 * 1000),
      templates: this.generateRandomTemplateSequence(totalSteps, pathHash),
      completed: false
    };

    return pathData;
  }

  // Genera sequenza template con seed basato su pathHash
  generateRandomTemplateSequence(steps, pathHash) {
    // Usa pathHash come seed per randomizzazione deterministica
    const seed = parseInt(pathHash.substring(0, 8), 16);
    const rng = this.seededRandom(seed);
    
    const availableTemplates = [
      { type: 'timer', duration: () => 10 + Math.floor(rng() * 8) * 5 }, // 10-45s
      { type: 'timer_punish', duration: () => 15 + Math.floor(rng() * 6) * 5 }, // 15-40s
      { type: 'click', target: () => 3 + Math.floor(rng() * 7) }, // 3-9 clicks
      { type: 'click_drain', target: () => 10 + Math.floor(rng() * 15) } // 10-24 clicks
    ];

    const sequence = [];
    for (let i = 0; i < steps; i++) {
      const template = availableTemplates[Math.floor(rng() * availableTemplates.length)];
      const resolvedTemplate = { ...template };
      
      // Risolvi funzioni dinamiche con seed
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

  // RNG con seed per risultati deterministici
  seededRandom(seed) {
    let state = seed;
    return function() {
      state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
      return state / Math.pow(2, 32);
    };
  }

  // Cripta percorso per cookie
  encryptPath(pathData) {
    const text = JSON.stringify({
      pathHash: pathData.pathHash,
      shortId: pathData.shortId,
      currentStep: pathData.currentStep,
      expiresAt: pathData.expiresAt
    });
    
    const key = crypto.scryptSync(this.secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decripta percorso da cookie
  decryptPath(encryptedData) {
    try {
      const parts = encryptedData.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const key = crypto.scryptSync(this.secretKey, 'salt', 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  // Valida percorso
  validatePath(encryptedData) {
    const pathData = this.decryptPath(encryptedData);
    if (!pathData) return false;
    
    return Date.now() < pathData.expiresAt;
  }

  // Genera JavaScript per gestione cookie percorso
  generatePathCookieJS(pathData) {
    const encryptedPath = this.encryptPath(pathData);
    
    return `
      <script>
        // Sistema percorso client-side
        window.TrollPath = {
          data: '${encryptedPath}',
          
          // Salva percorso
          save: function() {
            try {
              localStorage.setItem('troll_path_${pathData.shortId}', this.data);
              document.cookie = 'troll_path=${encryptedPath}; path=/; max-age=' + (7*24*60*60);
            } catch(e) {
              console.warn('Path storage failed');
            }
          },
          
          // Carica percorso
          load: function() {
            try {
              return localStorage.getItem('troll_path_${pathData.shortId}') || this.getCookie('troll_path');
            } catch(e) {
              return this.getCookie('troll_path');
            }
          },
          
          // Helper cookie
          getCookie: function(name) {
            const value = '; ' + document.cookie;
            const parts = value.split('; ' + name + '=');
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
          },
          
          // Rileva modifica cookie (anti-tamper basic) - DISABILITATO
          detectTamper: function() {
            // Disabilitato per evitare loop infinito
            return false;
          },
          
          // Inizializza
          init: function() {
            if (!this.detectTamper()) {
              this.save();
            }
          }
        };
        
        // Auto-inizializza
        window.TrollPath.init();
      </script>
    `;
  }
}

module.exports = new ClientFingerprintManager();