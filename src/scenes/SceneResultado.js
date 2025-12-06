import Phaser from '../utils/phaser.js';
import { Button } from '../ui/Button.js';

/**
 * Cena de resultados do jogo
 */
export class SceneResultado extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneResultado' });
    }
    
    init(data) {
        this.gameData = data.gameData;
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
        
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
        
        // Resultado
        const resultado = this.gameData.getResultado();
        
        // Salvar progresso
        const nomeJogador = this.gameData.getNomeJogador();
        this.gameData.saveProgresso(
            nomeJogador,
            resultado.pontuacao,
            resultado.total,
            this.gameData.perguntasRespondidas
        );
        
        // Título
        const titulo = this.add.text(width / 2, height * 0.2, 'RESULTADO', {
            fontSize: '48px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#FFFFFF'
        });
        titulo.setOrigin(0.5);
        
        // Card de pontuação
        const cardBg = this.add.rectangle(width / 2, height * 0.4, width * 0.6, 300, 0x1E293B, 0.9);
        cardBg.setStrokeStyle(3, 0x2563EB);
        
        // Pontuação
        const pontuacaoText = this.add.text(width / 2, height * 0.35, `${resultado.pontuacao}/${resultado.total}`, {
            fontSize: '72px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#06B6D4'
        });
        pontuacaoText.setOrigin(0.5);
        
        // Porcentagem
        const porcentagemText = this.add.text(width / 2, height * 0.45, `${resultado.porcentagem}%`, {
            fontSize: '36px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#FFFFFF'
        });
        porcentagemText.setOrigin(0.5);
        
        // Mensagem
        let mensagem = '';
        let corMensagem = 0x06B6D4;
        
        if (resultado.porcentagem >= 90) {
            mensagem = 'Excelente! Você domina a química!';
            corMensagem = 0x10B981;
        } else if (resultado.porcentagem >= 70) {
            mensagem = 'Muito bom! Continue estudando!';
            corMensagem = 0x06B6D4;
        } else if (resultado.porcentagem >= 50) {
            mensagem = 'Bom trabalho! Pratique mais!';
            corMensagem = 0xF59E0B;
        } else {
            mensagem = 'Continue estudando! Você consegue!';
            corMensagem = 0xEF4444;
        }
        
        const mensagemText = this.add.text(width / 2, height * 0.55, mensagem, {
            fontSize: '24px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#FFFFFF',
            wordWrap: { width: width * 0.5 },
            align: 'center'
        });
        mensagemText.setOrigin(0.5);
        
        // Botões
        const btnJogarNovamente = new Button(
            this,
            width / 2,
            height * 0.75,
            'JOGAR NOVAMENTE',
            () => this.scene.start('SceneJogo'),
            {
                backgroundColor: 0x2563EB,
                hoverColor: 0x06B6D4,
                width: 350,
                height: 70
            }
        );
        
        const btnMenu = new Button(
            this,
            width / 2,
            height * 0.85,
            'MENU PRINCIPAL',
            () => this.scene.start('SceneInicial'),
            {
                backgroundColor: 0x4B5563,
                hoverColor: 0x6B7280,
                width: 350,
                height: 70
            }
        );
        
        // Animação de entrada
        this.cameras.main.fadeIn(500);
        
        // Animação da pontuação
        this.tweens.add({
            targets: pontuacaoText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            ease: 'Power2'
        });
    }
}

