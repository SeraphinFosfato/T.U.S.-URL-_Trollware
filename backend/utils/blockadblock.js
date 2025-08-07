/*
 * BlockAdBlock 3.2.1
 * Copyright (c) 2015 Valentin Allaire <valentin.allaire@sitexw.fr>
 * Released under the MIT license
 * https://github.com/sitexw/BlockAdBlock
 */

(function(window) {
	var BlockAdBlock = function(options) {
		this._options = {
			checkOnLoad:		false,
			resetOnEnd:			false,
			loopCheckTime:		50,
			loopMaxNumber:		5,
			baitClass:			'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
			baitStyle:			'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;',
			debug:				false
		};
		this._var = {
			version:			'3.2.1',
			bait:				null,
			checking:			false,
			loop:				null,
			loopNumber:			0,
			event:				{ detected: [], notDetected: [] }
		};
		if(options !== undefined) {
			this.setOption(options);
		}
		var self = this;
		var eventCallback = function() {
			setTimeout(function() {
				if(self._options.checkOnLoad === true) {
					if(self._options.debug === true) {
						self._log('onload->eventCallback', 'A check loading is launched');
					}
					if(self.check() === true) {
						self._creatBait();
					}
				}
			}, 1);
		};
		if(typeof window.addEventListener !== 'undefined') {
			window.addEventListener('load', eventCallback, false);
		} else {
			window.attachEvent('onload', eventCallback);
		}
	};
	BlockAdBlock.prototype._options = null;
	BlockAdBlock.prototype._var = null;
	BlockAdBlock.prototype._bait = null;
	
	BlockAdBlock.prototype._log = function(method, message) {
		console.log('[BlockAdBlock]['+method+'] '+message);
	};
	
	BlockAdBlock.prototype.setOption = function(options, value) {
		if(value !== undefined) {
			var key = options;
			options = {};
			options[key] = value;
		}
		for(var option in options) {
			this._options[option] = options[option];
			if(this._options.debug === true) {
				this._log('setOption', 'The option "'+option+'" he was assigned to "'+options[option]+'"');
			}
		}
		return this;
	};
	
	BlockAdBlock.prototype._creatBait = function() {
		var bait = document.createElement('div');
		bait.setAttribute('class', this._options.baitClass);
		bait.setAttribute('style', this._options.baitStyle);
		this._var.bait = document.body.appendChild(bait);
		
		this._var.loopNumber = 0;
		if(this._options.debug === true) {
			this._log('_creatBait', 'Bait has been created');
		}
		this._loopCheck();
	};
	
	BlockAdBlock.prototype._destroyBait = function() {
		document.body.removeChild(this._var.bait);
		this._var.bait = null;
		
		this._var.checking = false;
		if(this._options.debug === true) {
			this._log('_destroyBait', 'Bait has been removed');
		}
	};
	
	BlockAdBlock.prototype.check = function(loop) {
		if(loop === undefined) {
			loop = true;
		}
		
		if(this._options.debug === true) {
			this._log('check', 'An audit was requested '+(loop===true?'with a':'without')+' loop');
		}
		
		if(this._var.checking === true) {
			if(this._options.debug === true) {
				this._log('check', 'A check was canceled because there is already an ongoing');
			}
			return false;
		}
		this._var.checking = true;
		
		if(this._var.bait === null) {
			this._creatBait();
		}
		
		if(loop === true) {
			this._loopCheck();
		}
		return true;
	};
	
	BlockAdBlock.prototype._loopCheck = function(init) {
		var self = this;
		
		if(init === undefined) {
			init = true;
		}
		
		this._var.loopNumber++;
		if(this._var.loopNumber >= this._options.loopMaxNumber) {
			this._stopLoop();
			this._destroyBait();
			this.emitEvent(true);
			if(this._options.debug === true) {
				this._log('_loopCheck', 'A check loop ended, value: not detected');
			}
		} else {
			if(this._options.debug === true) {
				this._log('_loopCheck', 'A check loop is launched');
			}
			
			if(this._var.bait === null) {
				this._creatBait();
			}
			
			if(this._var.bait.offsetParent === null 
			|| this._var.bait.offsetHeight == 0 
			|| this._var.bait.offsetLeft == 0 
			|| this._var.bait.offsetTop == 0 
			|| this._var.bait.offsetWidth == 0 
			|| this._var.bait.clientHeight == 0 
			|| this._var.bait.clientWidth == 0) {
				this._stopLoop();
				this._destroyBait();
				this.emitEvent(false);
				if(this._options.debug === true) {
					this._log('_loopCheck', 'A check loop ended, value: detected');
				}
			} else {
				this._var.loop = setTimeout(function() {
					self._loopCheck(false);
				}, this._options.loopCheckTime);
			}
		}
	};
	
	BlockAdBlock.prototype._stopLoop = function() {
		clearTimeout(this._var.loop);
		this._var.loop = null;
		this._var.loopNumber = 0;
	};
	
	BlockAdBlock.prototype.emitEvent = function(detected) {
		if(this._options.debug === true) {
			this._log('emitEvent', 'An event with a value of "'+detected+'" was called');
		}
		
		var fns = this._var.event[(detected === true ? 'notDetected' : 'detected')];
		for(var i in fns) {
			if(this._options.debug === true) {
				this._log('emitEvent', 'Call function '+(parseInt(i)+1)+'/'+fns.length);
			}
			if(fns.hasOwnProperty(i)) {
				fns[i]();
			}
		}
		if(this._options.resetOnEnd === true) {
			this.clearEvent();
		}
	};
	
	BlockAdBlock.prototype.clearEvent = function() {
		this._var.event.detected = [];
		this._var.event.notDetected = [];
		
		if(this._options.debug === true) {
			this._log('clearEvent', 'The event list has been cleared');
		}
	};
	
	BlockAdBlock.prototype.on = function(detected, fn) {
		this._var.event[(detected === true ? 'detected' : 'notDetected')].push(fn);
		if(this._options.debug === true) {
			this._log('on', 'A type of event "'+(detected === true ? 'detected' : 'notDetected')+'" was added');
		}
		
		return this;
	};
	
	BlockAdBlock.prototype.onDetected = function(fn) {
		return this.on(true, fn);
	};
	
	BlockAdBlock.prototype.onNotDetected = function(fn) {
		return this.on(false, fn);
	};
	
	// Make library available
	window.BlockAdBlock = BlockAdBlock;
	
	if(typeof window.blockAdBlock === 'undefined') {
		window.blockAdBlock = new BlockAdBlock({
			checkOnLoad: true,
			resetOnEnd: false
		});
	}
	
})(window);