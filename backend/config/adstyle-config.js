// AdStyle Configuration
const adStyleConfig = {
  // Publisher ID
  publisherId: '3819',
  
  // Script template
  getAdStyleScript: () => {
    return `<script>(function(w,d,s,a){var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl='&.='+new Date().getTime()
    ,r=d.referrer;r=!!r&&r!==d.location.href?'&r='+r:'';j.async=true;
    w['.']=a;j.src= '//pubtagmanager.com/ptm.js?id='+a+dl+r;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','3819');</script>`;
  },
  
  // Settings
  settings: {
    enabled: true,
    revenueThreshold: 2
  }
};

module.exports = adStyleConfig;