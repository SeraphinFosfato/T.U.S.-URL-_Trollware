// Sistema di debug completo per produzione
class DebugLogger {
  constructor() {
    this.enabled = process.env.DEBUG_MODE !== 'false';
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
  }

  log(level, category, message, data = null) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    
    const logLine = `[${timestamp}] [${level}] [${category}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
    
    console.log(logLine);
    
    // In produzione, potresti inviare a servizio logging esterno
    if (level === 'ERROR') {
      console.error('🚨 ERROR DETECTED:', logEntry);
    }
  }

  info(category, message, data = null) {
    this.log('INFO', category, message, data);
  }

  warn(category, message, data = null) {
    this.log('WARN', category, message, data);
  }

  error(category, message, data = null) {
    this.log('ERROR', category, message, data);
  }

  debug(category, message, data = null) {
    if (this.logLevel === 'DEBUG') {
      this.log('DEBUG', category, message, data);
    }
  }

  // Log specifici per il sistema
  fingerprint(action, fingerprint, data = null) {
    this.info('FINGERPRINT', `${action}: ${fingerprint}`, data);
  }

  database(operation, collection, data = null) {
    this.debug('DATABASE', `${operation} on ${collection}`, data);
  }

  antiTamper(action, fingerprint, data = null) {
    this.warn('ANTI-TAMPER', `${action} for ${fingerprint}`, data);
  }

  usage(metric, value, limit = null) {
    const status = limit ? `${value}/${limit} (${Math.round((value/limit)*100)}%)` : value;
    this.info('USAGE', `${metric}: ${status}`);
  }
}

module.exports = new DebugLogger();