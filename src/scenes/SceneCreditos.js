import Phaser from '../utils/phaser.js';
import { Button } from '../ui/Button.js';

/**
 * Cena de Créditos
 */
export class SceneCreditos extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneCreditos' });
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
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
        
        // Título principal com destaque
        const titulo = this.add.text(width / 2, 80, 'CRÉDITOS', {
            fontSize: '48px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#FFFFFF',
            stroke: '#06B6D4',
            strokeThickness: 3,
            shadow: {
                offsetX: 0,
                offsetY: 4,
                color: '#2563EB',
                blur: 20,
                stroke: true,
                fill: true
            }
        });
        titulo.setOrigin(0.5);
        
        // Linha decorativa abaixo do título
        const linha = this.add.rectangle(width / 2, 130, 200, 3, 0x06B6D4);
        linha.setAlpha(0.6);
        
        // Nome do jogo
        const nomeJogo = this.add.text(width / 2, 180, 'QUÍMICA EM AÇÃO', {
            fontSize: '32px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#06B6D4',
            stroke: '#2563EB',
            strokeThickness: 2
        });
        nomeJogo.setOrigin(0.5);
        
        const subtitulo = this.add.text(width / 2, 220, 'Jogo Educacional de Química', {
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: '#9CA3AF'
        });
        subtitulo.setOrigin(0.5);
        
        // Seção Desenvolvido por
        const secaoDev = this.add.text(width / 2, 280, 'DESENVOLVIDO POR', {
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#9CA3AF',
            letterSpacing: 2
        });
        secaoDev.setOrigin(0.5);
        
        // Nomes dos desenvolvedores com cards
        const desenvolvedores = [
            'JOÃO ALEXANDRE DA SILVA MARTINS',
            'LUCAS BRITO LOPES',
            'PLÁCIDO FRANCISCO DA SILVA JUNIOR'
        ];
        
        const devStartY = 330;
        const devSpacing = 50;
        
        desenvolvedores.forEach((nome, index) => {
            // Card de fundo para cada nome
            const card = this.add.rectangle(width / 2, devStartY + (index * devSpacing), 600, 40, 0x1E293B, 0.8);
            card.setStrokeStyle(2, 0x06B6D4);
            card.setAlpha(0.7);
            
            // Nome
            const nomeText = this.add.text(width / 2, devStartY + (index * devSpacing), nome, {
                fontSize: '18px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: '#06B6D4'
            });
            nomeText.setOrigin(0.5);
            
            // Animação de entrada
            card.setAlpha(0);
            nomeText.setAlpha(0);
            this.tweens.add({
                targets: [card, nomeText],
                alpha: 0.7,
                delay: index * 100,
                duration: 500,
                ease: 'Power2'
            });
        });
        
        // Seção Tecnologias
        const secaoTech = this.add.text(width / 2, devStartY + (desenvolvedores.length * devSpacing) + 40, 'TECNOLOGIAS', {
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#9CA3AF',
            letterSpacing: 2
        });
        secaoTech.setOrigin(0.5);
        
        const tecnologias = ['Phaser 3', 'Three.js', 'HTML5'];
        const techStartY = devStartY + (desenvolvedores.length * devSpacing) + 80;
        
        tecnologias.forEach((tech, index) => {
            const techText = this.add.text(width / 2 - 100 + (index * 100), techStartY, `• ${tech}`, {
                fontSize: '16px',
                fontFamily: 'Inter',
                fontWeight: '400',
                color: '#06B6D4'
            });
            techText.setOrigin(0.5);
        });
        
        // Ano e direitos
        const ano = this.add.text(width / 2, techStartY + 60, '2025', {
            fontSize: '20px',
            fontFamily: 'Inter',
            fontWeight: '700',
            color: '#06B6D4'
        });
        ano.setOrigin(0.5);
        
        const direitos = this.add.text(width / 2, techStartY + 90, 'Todos os direitos reservados', {
            fontSize: '14px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: '#6B7280'
        });
        direitos.setOrigin(0.5);
        
        // Botão voltar
        const btnVoltar = new Button(
            this,
            width / 2,
            height * 0.85,
            'VOLTAR',
            () => this.scene.start('SceneInicial'),
            {
                backgroundColor: 0x4B5563,
                hoverColor: 0x6B7280,
                width: 300,
                height: 60
            }
        );
        
        // Fade in
        this.cameras.main.fadeIn(300);
    }
}

