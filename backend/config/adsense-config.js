// Google AdSense Configuration
const adsenseConfig = {
  // Publisher ID
  publisherId: 'ca-pub-4018963456652435',
  
  // Meta tag for verification
  getMetaTag: () => {
    return '<meta name="google-adsense-account" content="ca-pub-4018963456652435">';
  },
  
  // Settings
  settings: {
    enabled: true,
    autoAds: false, // Disable auto ads for troll experience
    revenueThreshold: 2
  }
};

module.exports = adsenseConfig;