// Debug completo per template system
class TemplateDebugger {
  constructor() {
    this.logger = require('./debug-logger');
  }

  // Debug generazione template
  debugTemplateGeneration(template, targetTime, actualTime) {
    this.logger.info('TEMPLATE_DEBUG', 'Template generation analysis', {
      type: template.type,
      subtype: template.subtype,
      targetTime,
      actualTime,
      efficiency: Math.round((actualTime / targetTime) * 100) + '%',
      variance: actualTime - targetTime
    });
  }

  // Debug HTML generation
  debugHTMLGeneration(template, htmlLength, nextUrl) {
    this.logger.info('HTML_DEBUG', 'HTML generation analysis', {
      templateType: template.type,
      templateSubtype: template.subtype,
      htmlLength,
      nextUrl,
      hasSessionJS: htmlLength > 1000,
      isMinimal: htmlLength < 500
    });
  }

  // Debug timer controls
  debugTimerControls(template, controlsType) {
    this.logger.info('TIMER_DEBUG', 'Timer controls analysis', {
      templateSubtype: template.subtype,
      duration: template.duration,
      controlsType,
      isPunish: template.subtype === 'timer_punish',
      hasBlurControl: controlsType.includes('blur'),
      hasVisibilityControl: controlsType.includes('visibility')
    });
  }

  // Debug composite template
  debugCompositeTemplate(template) {
    this.logger.warn('COMPOSITE_DEBUG', 'Composite template detected', {
      subtype: template.subtype,
      hasSequence: !!template.sequence,
      sequenceLength: template.sequence ? template.sequence.length : 0,
      estimatedTime: template.estimatedTime,
      fallbackUsed: true
    });
  }

  // Debug cookie/session
  debugSession(pathData, cookieData) {
    this.logger.info('SESSION_DEBUG', 'Session analysis', {
      pathHash: pathData.pathHash,
      shortId: pathData.shortId,
      fingerprint: pathData.fingerprint,
      currentStep: pathData.currentStep,
      templatesCount: pathData.templates.length,
      cookieValid: !!cookieData,
      cookieSize: cookieData ? cookieData.length : 0
    });
  }

  // Debug focus/blur events
  debugFocusEvents(template, eventType, currentState) {
    this.logger.info('FOCUS_DEBUG', 'Focus event analysis', {
      templateType: template.type,
      templateSubtype: template.subtype,
      eventType,
      currentState,
      shouldPause: eventType === 'blur' && template.subtype !== 'timer_punish',
      shouldReset: eventType === 'blur' && template.subtype === 'timer_punish'
    });
  }
}

module.exports = new TemplateDebugger();