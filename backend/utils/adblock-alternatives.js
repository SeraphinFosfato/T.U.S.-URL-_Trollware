// AdBlock Alternative Solutions
class AdBlockAlternatives {
  constructor() {
    this.alternatives = {
      // Opzione 1: Ticket bypass
      ticket: {
        enabled: true,
        price: 0.99, // $0.99 per bypass
        duration: 24 * 60 * 60 * 1000, // 24 ore
        description: 'Skip ads for 24 hours'
      },
      
      // Opzione 2: Tempo doppio (COMPLESSA)
      doubleTime: {
        enabled: false, // Disabilitata per complessità
        multiplier: 2.0,
        description: 'Complete games with double time penalty'
      }
    };
  }
  
  // Genera opzioni alternative per utente con AdBlock
  generateAlternatives(originalTime, revenue) {
    const options = [];
    
    // Opzione ticket sempre disponibile
    if (this.alternatives.ticket.enabled) {
      options.push({
        type: 'ticket',
        title: '🎫 Skip Pass',
        description: `Pay $${this.alternatives.ticket.price} to skip all ads for 24h`,
        action: 'redirect_to_payment',
        price: this.alternatives.ticket.price
      });
    }
    
    // Opzione tempo doppio (se abilitata)
    if (this.alternatives.doubleTime.enabled) {
      const doubleTime = Math.ceil(originalTime * this.alternatives.doubleTime.multiplier);
      options.push({
        type: 'double_time',
        title: '⏰ Extended Challenge',
        description: `Complete games with ${doubleTime}s total time (no ads)`,
        action: 'regenerate_with_penalty',
        newTime: doubleTime
      });
    }
    
    return options;
  }
  
  // HTML per mostrare alternative
  generateAlternativesHTML(alternatives) {
    const optionsHTML = alternatives.map(alt => `
      <div class="alternative-option" onclick="selectAlternative('${alt.type}')">
        <h4>${alt.title}</h4>
        <p>${alt.description}</p>
        ${alt.price ? `<span class="price">$${alt.price}</span>` : ''}
      </div>
    `).join('');
    
    return `
      <div class="adblock-alternatives">
        <h3>🚫 AdBlock Detected - Choose Alternative</h3>
        <p>We detected you're using AdBlock. Choose how to proceed:</p>
        <div class="alternatives-grid">
          ${optionsHTML}
        </div>
        <div class="alternative-option" onclick="disableAdBlock()">
          <h4>🛡️ Disable AdBlock</h4>
          <p>Turn off AdBlock for this site (recommended)</p>
        </div>
      </div>
      <style>
        .adblock-alternatives {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          margin: 50px auto;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .alternatives-grid {
          display: grid;
          gap: 15px;
          margin: 20px 0;
        }
        .alternative-option {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .alternative-option:hover {
          border-color: #007bff;
          background: #f8f9fa;
        }
        .price {
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: bold;
        }
      </style>
    `;
  }
}

module.exports = new AdBlockAlternatives();