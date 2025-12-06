/**
 * Componente de botão reutilizável com animações
 */
export class Button {
    constructor(scene, x, y, text, callback, style = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.text = text;
        this.callback = callback;
        this.style = {
            fontSize: style.fontSize || '24px',
            fontFamily: style.fontFamily || 'Inter',
            fontWeight: style.fontWeight || '600',
            color: style.color || '#FFFFFF',
            backgroundColor: style.backgroundColor || 0x2563EB,
            hoverColor: style.hoverColor || 0x06B6D4,
            width: style.width || 300,
            height: style.height || 60,
            ...style
        };
        
        this.create();
    }
    
    create() {
        // Container do botão
        this.container = this.scene.add.container(this.x, this.y);
        
        // Background
        this.bg = this.scene.add.rectangle(
            0, 0,
            this.style.width,
            this.style.height,
            this.style.backgroundColor
        );
        this.bg.setStrokeStyle(2, 0xFFFFFF, 0.3);
        this.bg.setInteractive({ useHandCursor: true });
        
        // Texto
        this.label = this.scene.add.text(0, 0, this.text, {
            fontSize: this.style.fontSize,
            fontFamily: this.style.fontFamily,
            fontWeight: this.style.fontWeight,
            color: this.style.color
        });
        this.label.setOrigin(0.5);
        
        this.container.add([this.bg, this.label]);
        
        // Interações
        this.bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this.bg,
                scaleX: 1.05,
                scaleY: 1.05,
                tint: this.style.hoverColor,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        this.bg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this.bg,
                scaleX: 1,
                scaleY: 1,
                tint: this.style.backgroundColor,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        this.bg.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: this.bg,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
            
            if (this.callback) {
                this.scene.time.delayedCall(100, () => {
                    this.callback();
                });
            }
        });
    }
    
    setVisible(visible) {
        this.container.setVisible(visible);
    }
    
    destroy() {
        this.container.destroy();
    }
}

