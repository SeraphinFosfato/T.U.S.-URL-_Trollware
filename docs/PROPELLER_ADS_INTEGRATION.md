# PropellerAds Integration Guide

## ⚠️ CRITICAL: Obfuscated Code Handling

**NEVER directly read, edit, or include obfuscated PropellerAds scripts in JS files.**

### Why This Causes Timeouts
- Scripts are heavily obfuscated (thousands of characters on single lines)
- Contains mixed HTML/JS that breaks parsers
- Causes AI assistants to timeout when processing

### Safe Implementation Method

1. **Store scripts in text files** (`backend/config/propeller-scripts.txt`)
2. **Use helper functions** to read them as raw strings
3. **Never parse as JavaScript** - treat as HTML strings only

## 🚀 SISTEMA LIVE E OPERATIVO

### Status: REVENUE ATTIVO
- **PropellerAds Reali**: Script veri integrati e funzionanti
- **Anti-AdBlock**: BlockAdBlock + DNS detection completa
- **Troll Integration**: Overlay "NICE TRY, SMARTASS!" operativo
- **Multi-Template**: Header, sidebar, footer con ads reali

## Current Integration

### Files Structure
```
backend/config/
├── propeller-config.js     # Configuration and helper functions
└── propeller-scripts.txt   # Raw obfuscated scripts (DO NOT EDIT)
```

### PropellerAds Zones
- **Vignette Banner**: Zone 9677091 (AdBlock-resistant)
- **In-Page Push**: Zone 9677112 (AdBlock-resistant) 
- **Direct Link**: https://otieu.com/4/9677119 (blocked by AdBlock)

### Integration Points
- **Header slot**: Vignette banner (revenue level 2+)
- **Sidebar slot**: In-page push (revenue level 4+)
- **Direct link**: Not implemented (AdBlock blocks it)

### Revenue Thresholds
- Revenue 1: No ads
- Revenue 2+: Vignette banner in header
- Revenue 4+: Vignette + In-page push
- Revenue 8: All slots (future expansion)

## Adding New Scripts

1. **Get script from PropellerAds dashboard**
2. **Paste in propeller-scripts.txt** between appropriate markers
3. **Update propeller-config.js** helper functions if needed
4. **Test without reading obfuscated code**

## Testing

```bash
# Test ad integration
node tests/test-ads-quick.js

# Generate test links with ads
node generate-test-links.js
```

## Future Maintenance

- **Never open obfuscated script files** in IDE
- **Use text file approach** for all ad network integrations
- **Keep helper functions simple** - just string extraction
- **Document any new ad networks** using this same pattern

This approach prevents AI timeout issues while maintaining full functionality.