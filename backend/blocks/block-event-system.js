// Sistema di eventi globale per blocchi atomici
const BlockEventSystem = {
  // Genera il JavaScript del sistema eventi da includere in ogni pagina
  generateEventSystemJS() {
    return `
      <script>
        // Sistema eventi globale per blocchi
        window.BlockEventSystem = {
          blocks: new Map(),
          
          // Registra un blocco
          registerBlock(blockId, config) {
            this.blocks.set(blockId, {
              id: blockId,
              enabled: config.enabled || false,
              completed: false,
              onComplete: config.onComplete || null,
              nextBlockId: config.nextBlockId || null,
              element: document.getElementById(blockId + '-container'),
              ...config
            });
            
            // Se disabilitato, nascondi e ferma
            if (!config.enabled) {
              this.disableBlock(blockId);
            }
          },
          
          // Abilita un blocco
          enableBlock(blockId) {
            const block = this.blocks.get(blockId);
            if (!block) return;
            
            block.enabled = true;
            if (block.element) {
              block.element.style.opacity = '1';
              block.element.style.pointerEvents = 'auto';
            }
            
            // Emetti evento di abilitazione
            document.dispatchEvent(new CustomEvent('blockEnabled', {
              detail: { blockId, block }
            }));
          },
          
          // Disabilita un blocco
          disableBlock(blockId) {
            const block = this.blocks.get(blockId);
            if (!block) return;
            
            block.enabled = false;
            if (block.element) {
              block.element.style.opacity = '0.3';
              block.element.style.pointerEvents = 'none';
            }
            
            // Emetti evento di disabilitazione
            document.dispatchEvent(new CustomEvent('blockDisabled', {
              detail: { blockId, block }
            }));
          },
          
          // Completa un blocco
          completeBlock(blockId, result = null) {
            const block = this.blocks.get(blockId);
            if (!block || !block.enabled) return;
            
            block.completed = true;
            block.result = result;
            
            // Emetti evento di completamento
            document.dispatchEvent(new CustomEvent('blockCompleted', {
              detail: { blockId, block, result }
            }));
            
            // Gestisci azione successiva
            if (block.nextBlockId) {
              this.enableBlock(block.nextBlockId);
            } else if (block.nextUrl) {
              // Ultimo blocco - vai al nextUrl
              setTimeout(() => {
                window.location.href = block.nextUrl;
              }, 500);
            }
          },
          
          // Pausa tutti i blocchi tranne quello specificato
          pauseAllExcept(activeBlockId) {
            this.blocks.forEach((block, blockId) => {
              if (blockId !== activeBlockId && block.enabled && !block.completed) {
                document.dispatchEvent(new CustomEvent('blockPause', {
                  detail: { blockId }
                }));
              }
            });
          },
          
          // Riprendi tutti i blocchi abilitati
          resumeAll() {
            this.blocks.forEach((block, blockId) => {
              if (block.enabled && !block.completed) {
                document.dispatchEvent(new CustomEvent('blockResume', {
                  detail: { blockId }
                }));
              }
            });
          }
        };
        
        // Event listeners globali per visibilità
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            window.BlockEventSystem.pauseAllExcept(null);
          } else {
            window.BlockEventSystem.resumeAll();
          }
        });
        
        window.addEventListener('blur', function() {
          window.BlockEventSystem.pauseAllExcept(null);
        });
        
        window.addEventListener('focus', function() {
          window.BlockEventSystem.resumeAll();
        });
      </script>
    `;
  }
};

module.exports = { BlockEventSystem };