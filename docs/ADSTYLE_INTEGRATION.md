# AdStyle Integration Guide

## 🚀 SISTEMA LIVE E OPERATIVO

### Status: REVENUE ATTIVO
- **AdStyle Reali**: Script Publisher Tag Manager integrati e funzionanti
- **Anti-AdBlock**: BlockAdBlock + DNS detection completa
- **Troll Integration**: Overlay "NICE TRY, SMARTASS!" operativo
- **Multi-Template**: Header, sidebar, footer con ads reali

## Current Integration

### Files Structure
```
backend/config/
├── adstyle-config.js       # Configuration and helper functions
```

### AdStyle Configuration
- **Publisher ID**: 3819
- **Script URL**: `//pubtagmanager.com/ptm.js?id=3819`
- **Integration**: Automatic on all pages with revenue ≥ 2

### Integration Points
- **Header slot**: AdStyle script (revenue level 2+)
- **Sidebar slot**: AdStyle script (revenue level 3+)
- **Footer slot**: AdStyle script (revenue level 3+)

### Revenue Thresholds
- Revenue 1: No ads
- Revenue 2+: Header ads
- Revenue 3+: Header + Sidebar + Footer
- Revenue 6+: + Interstitial
- Revenue 8: All slots

## Script Integration

### Automatic Injection
AdStyle script is automatically injected in:
- All template HTML headers
- Index.html homepage
- Ad slot areas when revenue threshold is met

### Script Template
```javascript
<script>(function(w,d,s,a){var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl='&.='+new Date().getTime()
,r=d.referrer;r=!!r&&r!==d.location.href?'&r='+r:'';j.async=true;
w['.']=a;j.src= '//pubtagmanager.com/ptm.js?id='+a+dl+r;
f.parentNode.insertBefore(j,f);
})(window,document,'script','3819');</script>
```

## Testing

```bash
# Test ad integration
node tests/test-ads-quick.js

# Generate test links with ads
node generate-test-links.js
```

## Anti-AdBlock Integration

### Detection Methods
- **BlockAdBlock 3.2.1**: Professional library
- **AdStyle Specific**: Test on `pubtagmanager.com`
- **DNS Blocking**: Detects ISP/router blocks with 5s timeout
- **Troll Messages**: "NICE TRY, SMARTASS!" with ragebait

### Browser Support
- Chrome, Firefox, Safari, Edge
- Opera GX detection with warnings
- Mobile browsers supported

## Future Maintenance

- **Monitor Performance**: AdStyle dashboard analytics
- **Update Publisher ID**: If needed for account changes
- **A/B Testing**: Different ad placements
- **Revenue Optimization**: Adjust thresholds based on performance

This integration provides seamless ad monetization across all TrollShortener pages.