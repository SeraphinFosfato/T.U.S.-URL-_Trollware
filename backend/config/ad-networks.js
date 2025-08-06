// Configurazione reti pubblicitarie
const adNetworks = {
  medianet: {
    enabled: false, // Attiva quando hai i codici
    publisherId: 'YOUR_PUBLISHER_ID',
    adUnits: {
      header: 'HEADER_AD_UNIT_ID',
      sidebar: 'SIDEBAR_AD_UNIT_ID',
      footer: 'FOOTER_AD_UNIT_ID'
    }
  },
  
  propellerads: {
    enabled: false, // Attiva quando hai i codici
    publisherId: 'YOUR_PUBLISHER_ID',
    zones: {
      banner: 'BANNER_ZONE_ID',
      popup: 'POPUP_ZONE_ID',
      push: 'PUSH_ZONE_ID'
    }
  }
};

module.exports = adNetworks;