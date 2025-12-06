import Phaser from '../utils/phaser.js';
import { Button } from '../ui/Button.js';
import { GameData } from '../utils/GameData.js';

/**
 * Cena de Configurações
 */
export class SceneConfiguracoes extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneConfiguracoes' });
        this.gameData = new GameData();
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Ocultar renderer 3D
        if (window.threeRenderer) {
            window.threeRenderer.setVisible(false);
        }
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.style.display = 'none';
        }
        
        // Background com gradiente
        this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
        
        // Título com destaque
        const titulo = this.add.text(width / 2, 80, 'CONFIGURAÇÕES', {
            fontSize: '48px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#FFFFFF',
            stroke: '#06B6D4',
            strokeThickness: 2
        });
        titulo.setOrigin(0.5);
        
        const config = this.gameData.getConfig();
        
        // Container principal das opções
        const optionsContainer = this.add.container(width / 2, height * 0.45);
        
        // Card de fundo para as opções
        const cardBg = this.add.rectangle(0, 0, width * 0.7, height * 0.6, 0x1E293B, 0.8);
        cardBg.setStrokeStyle(3, 0x2563EB);
        cardBg.setOrigin(0.5);
        optionsContainer.add(cardBg);
        
        // Opções com melhor espaçamento
        const startY = -height * 0.2;
        const spacing = 90;
        
        // Seção de Áudio
        const audioLabel = this.add.text(0, startY - 20, 'ÁUDIO', {
            fontSize: '20px',
            fontFamily: 'Inter',
            fontWeight: '700',
            color: '#06B6D4'
        });
        audioLabel.setOrigin(0.5);
        optionsContainer.add(audioLabel);
        
        // Som
        const somToggle = this.createToggle(0, startY + spacing * 0.5, 'SOM', config.som, (value) => {
            this.gameData.updateConfig({ som: value });
        });
        optionsContainer.add(somToggle);
        
        // Música
        const musicaToggle = this.createToggle(0, startY + spacing * 1.5, 'MÚSICA', config.musica, (value) => {
            this.gameData.updateConfig({ musica: value });
        });
        optionsContainer.add(musicaToggle);
        
        // Seção de Dificuldade
        const dificuldadeLabel = this.add.text(0, startY + spacing * 2.5, 'DIFICULDADE', {
            fontSize: '20px',
            fontFamily: 'Inter',
            fontWeight: '700',
            color: '#06B6D4'
        });
        dificuldadeLabel.setOrigin(0.5);
        optionsContainer.add(dificuldadeLabel);
        
        // Dificuldade
        const dificuldadeSelector = this.createDificuldadeSelector(0, startY + spacing * 3.5, config.dificuldade);
        optionsContainer.add(dificuldadeSelector);
        
        // Botão voltar
        const btnVoltar = new Button(
            this,
            width / 2,
            height * 0.88,
            '← VOLTAR',
            () => this.scene.start('SceneInicial'),
            {
                backgroundColor: 0x4B5563,
                hoverColor: 0x6B7280,
                width: 280,
                height: 55,
                fontSize: '18px'
            }
        );
        
        // Animação de entrada
        optionsContainer.setAlpha(0);
        this.tweens.add({
            targets: optionsContainer,
            alpha: 1,
            y: optionsContainer.y - 30,
            duration: 500,
            ease: 'Power2'
        });
        
        // Fade in
        this.cameras.main.fadeIn(300);
    }
    
    createToggle(x, y, label, value, callback) {
        const container = this.add.container(x, y);
        
        // Label com ícone
        const icon = value ? '🔊' : '🔇';
        const labelText = this.add.text(-180, 0, `${icon} ${label}`, {
            fontSize: '22px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#FFFFFF'
        });
        labelText.setOrigin(0, 0.5);
        
        // Toggle background (maior e mais visível)
        const toggleBg = this.add.rectangle(120, 0, 90, 45, value ? 0x10B981 : 0x4B5563);
        toggleBg.setStrokeStyle(2, value ? 0x059669 : 0x6B7280);
        toggleBg.setInteractive({ useHandCursor: true });
        
        // Toggle circle (maior)
        const toggleCircle = this.add.circle(value ? 145 : 95, 0, 18, 0xFFFFFF);
        toggleCircle.setStrokeStyle(2, 0xE5E7EB);
        
        // Efeito de brilho quando ativo
        if (value) {
            const glow = this.add.circle(145, 0, 20, 0x10B981, 0.3);
            container.add(glow);
        }
        
        container.add([labelText, toggleBg, toggleCircle]);
        
        // Área clicável maior
        const clickArea = this.add.rectangle(0, 0, 350, 60, 0x000000, 0);
        clickArea.setInteractive({ useHandCursor: true });
        container.add(clickArea);
        
        const toggle = () => {
            const newValue = !value;
            callback(newValue);
            
            // Atualizar ícone
            labelText.setText(`${newValue ? '🔊' : '🔇'} ${label}`);
            
            // Animação do background
            this.tweens.add({
                targets: toggleBg,
                fillColor: newValue ? 0x10B981 : 0x4B5563,
                duration: 250,
                ease: 'Power2'
            });
            
            this.tweens.add({
                targets: toggleBg,
                strokeColor: newValue ? 0x059669 : 0x6B7280,
                duration: 250
            });
            
            // Animação do círculo
            this.tweens.add({
                targets: toggleCircle,
                x: newValue ? 145 : 95,
                duration: 250,
                ease: 'Back.easeOut'
            });
            
            // Adicionar efeito de brilho ao ativar
            if (newValue) {
                const glow = this.add.circle(145, 0, 20, 0x10B981, 0.3);
                container.add(glow);
                this.tweens.add({
                    targets: glow,
                    alpha: 0,
                    scale: 1.5,
                    duration: 300,
                    onComplete: () => glow.destroy()
                });
            }
        };
        
        toggleBg.on('pointerdown', toggle);
        clickArea.on('pointerdown', toggle);
        
        return container;
    }
    
    createDificuldadeSelector(x, y, value) {
        const container = this.add.container(x, y);
        
        // Opções
        const opcoes = ['TODOS', 'BÁSICO', 'INTERMEDIÁRIO', 'AVANÇADO'];
        const valores = ['todos', 'basico', 'intermediario', 'avancado'];
        const cores = [0x06B6D4, 0x10B981, 0xF59E0B, 0xEF4444];
        
        const buttonSpacing = 140;
        const startX = -(buttonSpacing * 1.5);
        
        // Armazenar referências dos botões
        const buttons = [];
        
        opcoes.forEach((opcao, index) => {
            const isSelected = valores[index] === value;
            const btnX = startX + (index * buttonSpacing);
            
            // Background do botão
            const btnBg = this.add.rectangle(btnX, 0, 120, 50, isSelected ? cores[index] : 0x374151);
            btnBg.setStrokeStyle(2, isSelected ? 0xFFFFFF : 0x6B7280);
            btnBg.setInteractive({ useHandCursor: true });
            
            // Texto do botão
            const btnText = this.add.text(btnX, 0, opcao, {
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '700',
                color: '#FFFFFF'
            });
            btnText.setOrigin(0.5);
            btnText.setInteractive({ useHandCursor: true });
            
            // Efeito de brilho quando selecionado
            if (isSelected) {
                const glow = this.add.rectangle(btnX, 0, 120, 50, cores[index], 0.3);
                container.add(glow);
            }
            
            container.add([btnBg, btnText]);
            
            // Armazenar referências
            buttons.push({
                bg: btnBg,
                text: btnText,
                x: btnX,
                index: index,
                valor: valores[index],
                cor: cores[index]
            });
            
            const selectOption = () => {
                this.gameData.updateConfig({ dificuldade: valores[index] });
                
                // Atualizar todos os botões
                buttons.forEach((btn, i) => {
                    const isNowSelected = i === index;
                    
                    // Atualizar background
                    this.tweens.add({
                        targets: btn.bg,
                        fillColor: isNowSelected ? btn.cor : 0x374151,
                        duration: 200
                    });
                    
                    this.tweens.add({
                        targets: btn.bg,
                        strokeColor: isNowSelected ? 0xFFFFFF : 0x6B7280,
                        duration: 200
                    });
                    
                    // Efeito de seleção
                    if (isNowSelected) {
                        const pulse = this.add.rectangle(btn.x, 0, 120, 50, btn.cor, 0.5);
                        container.add(pulse);
                        this.tweens.add({
                            targets: pulse,
                            alpha: 0,
                            scaleX: 1.2,
                            scaleY: 1.2,
                            duration: 400,
                            onComplete: () => pulse.destroy()
                        });
                    }
                });
            };
            
            btnBg.on('pointerdown', selectOption);
            btnText.on('pointerdown', selectOption);
        });
        
        return container;
    }
}

