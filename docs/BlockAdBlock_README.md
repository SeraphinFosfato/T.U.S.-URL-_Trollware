# BlockAdBlock

Better blocking the ad blockers.

[![NPM version](https://img.shields.io/npm/v/blockadblock.svg)](https://www.npmjs.com/package/blockadblock)
[![Bower version](https://img.shields.io/bower/v/blockadblock.svg)](http://bower.io/search/?q=blockadblock)
[![Build Status](https://travis-ci.org/sitexw/BlockAdBlock.svg?branch=master)](https://travis-ci.org/sitexw/BlockAdBlock)

## Description

BlockAdBlock is a library to detect ad blockers (AdBlock, uBlock, etc.). It allows you to display a message to users who have an ad blocker enabled, asking them to disable it or whitelist your site.

## Features

- Detects most popular ad blockers
- Lightweight (< 5KB)
- Easy to use
- Customizable
- Works with all modern browsers

## Installation

### NPM
```bash
npm install blockadblock
```

### Bower
```bash
bower install blockadblock
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/blockadblock@3.2.1/dist/blockadblock.min.js"></script>
```

## Usage

### Basic Usage

```html
<script src="blockadblock.js"></script>
<script>
// Function called if AdBlock is not detected
function adBlockNotDetected() {
	alert('AdBlock is not enabled');
}

// Function called if AdBlock is detected
function adBlockDetected() {
	alert('AdBlock is enabled');
}

// Recommended audit because AdBlock lock the file blockadblock.js
if(typeof blockAdBlock === 'undefined') {
	// AdBlock is blocking this file
	adBlockDetected();
} else {
	blockAdBlock.onDetected(adBlockDetected);
	blockAdBlock.onNotDetected(adBlockNotDetected);
	// and|or
	blockAdBlock.on(true, adBlockDetected);
	blockAdBlock.on(false, adBlockNotDetected);
}
</script>
```