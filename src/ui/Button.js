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
        
        // Sombra do botão
        const shadow = this.scene.add.rectangle(0, 2, this.style.width, this.style.height, 0x000000, 0.2);
        
        // Background com bordas arredondadas (simulado com círculos)
        this.bg = this.scene.add.rectangle(
            0, 0,
            this.style.width,
            this.style.height,
            this.style.backgroundColor
        );
        this.bg.setStrokeStyle(2, 0xFFFFFF, 0.3);
        this.bg.setInteractive({ useHandCursor: true });
        
        // Círculos nas pontas para simular bordas arredondadas
        const cornerRadius = 15;
        const leftCircle = this.scene.add.circle(-this.style.width/2 + cornerRadius, 0, cornerRadius, this.style.backgroundColor);
        const rightCircle = this.scene.add.circle(this.style.width/2 - cornerRadius, 0, cornerRadius, this.style.backgroundColor);
        leftCircle.setStrokeStyle(2, 0xFFFFFF, 0.3);
        rightCircle.setStrokeStyle(2, 0xFFFFFF, 0.3);
        
        // Texto
        this.label = this.scene.add.text(0, 0, this.text, {
            fontSize: this.style.fontSize,
            fontFamily: this.style.fontFamily,
            fontWeight: this.style.fontWeight,
            color: this.style.color
        });
        this.label.setOrigin(0.5);
        
        this.container.add([shadow, this.bg, leftCircle, rightCircle, this.label]);
        
        // Armazenar círculos para animações
        this.leftCircle = leftCircle;
        this.rightCircle = rightCircle;
        
        // Interações
        this.bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [this.bg, this.leftCircle, this.rightCircle],
                scaleX: 1.05,
                scaleY: 1.05,
                tint: this.style.hoverColor,
                fillColor: this.style.hoverColor,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        this.bg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [this.bg, this.leftCircle, this.rightCircle],
                scaleX: 1,
                scaleY: 1,
                tint: this.style.backgroundColor,
                fillColor: this.style.backgroundColor,
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

