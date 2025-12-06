import Phaser from '../utils/phaser.js';
import { GameData } from '../utils/GameData.js';
import { Button } from '../ui/Button.js';

/**
 * Cena principal do jogo - Quiz de Química
 */
export class SceneJogo extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneJogo' });
        this.gameData = new GameData();
        this.perguntaAtual = null;
        this.botoesAlternativas = [];
        this.feedbackAtivo = false;
    }
    
    async create() {
        const { width, height } = this.cameras.main;
        
        // Ocultar renderer 3D completamente
        if (window.threeRenderer) {
            window.threeRenderer.setVisible(false);
        }
        // Garantir que o container 3D esteja oculto
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.style.display = 'none';
            threeContainer.style.zIndex = '-1';
        }
        
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
        
        // Carregar perguntas
        const perguntasCarregadas = await this.gameData.loadPerguntas();
        
        // Selecionar apenas 10 perguntas aleatórias para o jogo
        if (perguntasCarregadas.length > 10) {
            this.gameData.perguntas = this.gameData.shuffleArray([...perguntasCarregadas]).slice(0, 10);
        } else {
            this.gameData.perguntas = perguntasCarregadas;
        }
        
        if (this.gameData.perguntas.length === 0) {
            // Mostrar mensagem de erro se não conseguir carregar perguntas
            const erroText = this.add.text(width / 2, height / 2, 'Erro ao carregar perguntas.\nVerifique o arquivo data/perguntas.json', {
                fontSize: '20px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: '#EF4444',
                align: 'center'
            });
            erroText.setOrigin(0.5);
            
            const btnVoltar = this.add.text(width / 2, height / 2 + 60, '← VOLTAR AO MENU', {
                fontSize: '18px',
                fontFamily: 'Inter',
                fontWeight: '600',
                color: '#06B6D4'
            });
            btnVoltar.setOrigin(0.5);
            btnVoltar.setInteractive({ useHandCursor: true });
            btnVoltar.on('pointerdown', () => this.scene.start('SceneInicial'));
            
            return;
        }
        
        this.gameData.resetJogo();
        
        // HUD - Barra superior
        this.createHUD();
        
        // Carregar primeira pergunta
        this.carregarPergunta();
        
        // Fade in
        this.cameras.main.fadeIn(300);
    }
    
    createHUD() {
        const { width } = this.cameras.main;
        
        // Barra superior
        const hudBg = this.add.rectangle(width / 2, 30, width, 60, 0x1E293B, 0.8);
        
        // Botão voltar
        const btnVoltar = this.add.text(30, 30, '← VOLTAR', {
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#06B6D4'
        });
        btnVoltar.setInteractive({ useHandCursor: true });
        btnVoltar.on('pointerdown', () => {
            this.scene.start('SceneInicial');
        });
        btnVoltar.on('pointerover', () => {
            btnVoltar.setColor('#8B5CF6');
        });
        btnVoltar.on('pointerout', () => {
            btnVoltar.setColor('#06B6D4');
        });
        
        // Pontuação
        this.textPontuacao = this.add.text(150, 30, 'Pontos: 0', {
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#FFFFFF'
        });
        
        // Progresso
        this.textProgresso = this.add.text(width / 2, 30, 'Pergunta 1/10', {
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#06B6D4'
        });
        this.textProgresso.setOrigin(0.5);
        
        // Barra de progresso
        this.progressBarBg = this.add.rectangle(width - 150, 30, 200, 8, 0x374151);
        this.progressBar = this.add.rectangle(width - 150, 30, 0, 8, 0x06B6D4);
    }
    
    
    carregarPergunta() {
        const { width, height } = this.cameras.main;
        
        // Limpar pergunta anterior
        if (this.perguntaContainer) {
            this.perguntaContainer.destroy();
        }
        
        this.botoesAlternativas = [];
        this.feedbackAtivo = false;
        
        this.perguntaAtual = this.gameData.getPerguntaAtual();
        
        if (!this.perguntaAtual) {
            // Fim do jogo
            this.scene.start('SceneResultado', { gameData: this.gameData });
            return;
        }
        
        // Container da pergunta
        this.perguntaContainer = this.add.container(width / 2, height / 2);
        
        // Card da pergunta
        const cardBg = this.add.rectangle(0, -100, width * 0.8, 200, 0x1E293B, 0.9);
        cardBg.setStrokeStyle(2, 0x2563EB);
        
        // Texto da pergunta
        const textoPergunta = this.add.text(0, -100, this.perguntaAtual.enunciado, {
            fontSize: '24px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#FFFFFF',
            wordWrap: { width: width * 0.75 },
            align: 'center'
        });
        textoPergunta.setOrigin(0.5);
        
        this.perguntaContainer.add([cardBg, textoPergunta]);
        
        // Alternativas
        const startY = 50;
        const spacing = 80;
        
        this.perguntaAtual.alternativas.forEach((alternativa, index) => {
            const y = startY + (index * spacing);
            
            const btn = new Button(
                this,
                width / 2,
                height / 2 + y,
                `${String.fromCharCode(65 + index)}. ${alternativa}`,
                () => this.responderPergunta(index),
                {
                    backgroundColor: 0x1E3A8A,
                    hoverColor: 0x2563EB,
                    width: width * 0.7,
                    height: 60,
                    fontSize: '20px'
                }
            );
            
            this.botoesAlternativas.push(btn);
        });
        
        // Atualizar HUD
        this.atualizarHUD();
        
        // Animação de entrada
        this.perguntaContainer.setAlpha(0);
        this.tweens.add({
            targets: this.perguntaContainer,
            alpha: 1,
            y: this.perguntaContainer.y - 20,
            duration: 400,
            ease: 'Power2'
        });
    }
    
    atualizarHUD() {
        const total = this.gameData.perguntas.length;
        const atual = this.gameData.perguntaAtual + 1;
        
        this.textPontuacao.setText(`Pontos: ${this.gameData.pontuacao}`);
        this.textProgresso.setText(`Pergunta ${atual}/${total}`);
        
        const progresso = atual / total;
        this.tweens.add({
            targets: this.progressBar,
            width: progresso * 200,
            duration: 300
        });
    }
    
    responderPergunta(respostaIndex) {
        if (this.feedbackAtivo) return;
        
        this.feedbackAtivo = true;
        
        const resultado = this.gameData.responderPergunta(respostaIndex);
        const botaoClicado = this.botoesAlternativas[respostaIndex];
        const botaoCorreto = this.botoesAlternativas[this.perguntaAtual.resposta];
        
        // Feedback visual
        if (resultado.correta) {
            // Correto - verde
            this.tweens.add({
                targets: botaoClicado.bg,
                tint: 0x10B981,
                duration: 200
            });
            
            // Efeito de partículas
            this.createSuccessEffect(botaoClicado.container.x, botaoClicado.container.y);
        } else {
            // Errado - vermelho
            this.tweens.add({
                targets: botaoClicado.bg,
                tint: 0xEF4444,
                duration: 200
            });
            
            // Destacar resposta correta
            this.tweens.add({
                targets: botaoCorreto.bg,
                tint: 0x10B981,
                duration: 200
            });
        }
        
        // Mostrar explicação
        this.mostrarExplicacao(resultado.explicacao, resultado.correta);
        
        // Próxima pergunta após delay
        this.time.delayedCall(2500, () => {
            this.carregarPergunta();
        });
    }
    
    mostrarExplicacao(texto, correta) {
        const { width, height } = this.cameras.main;
        
        const cardExplicacao = this.add.container(width / 2, height - 150);
        
        const bg = this.add.rectangle(0, 0, width * 0.9, 120, correta ? 0x10B981 : 0xEF4444, 0.9);
        bg.setStrokeStyle(2, correta ? 0x059669 : 0xDC2626);
        
        const label = this.add.text(0, -30, correta ? '✓ CORRETO!' : '✗ INCORRETO', {
            fontSize: '22px',
            fontFamily: 'Inter',
            fontWeight: '700',
            color: '#FFFFFF'
        });
        label.setOrigin(0.5);
        
        const explicacao = this.add.text(0, 20, texto, {
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: '#FFFFFF',
            wordWrap: { width: width * 0.85 },
            align: 'center'
        });
        explicacao.setOrigin(0.5);
        
        cardExplicacao.add([bg, label, explicacao]);
        cardExplicacao.setAlpha(0);
        
        this.tweens.add({
            targets: cardExplicacao,
            alpha: 1,
            y: cardExplicacao.y - 20,
            duration: 300,
            onComplete: () => {
                this.tweens.add({
                    targets: cardExplicacao,
                    alpha: 0,
                    delay: 2000,
                    duration: 300,
                    onComplete: () => cardExplicacao.destroy()
                });
            }
        });
    }
    
    createSuccessEffect(x, y) {
        // Partículas de sucesso
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(x, y, 4, 0x10B981);
            const angle = (i / 10) * Math.PI * 2;
            const distance = Phaser.Math.Between(50, 100);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }
}

