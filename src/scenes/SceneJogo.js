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
        
        // Barra de progresso melhorada
        const progressBarX = width - 180;
        const progressBarY = 30;
        const progressBarWidth = 250;
        const progressBarHeight = 12;
        
        // Sombra da barra de fundo
        this.progressBarShadow = this.add.rectangle(progressBarX, progressBarY + 2, progressBarWidth, progressBarHeight, 0x000000, 0.3);
        this.progressBarShadow.setDepth(0);
        
        // Fundo da barra com borda
        this.progressBarBg = this.add.rectangle(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 0x1E293B, 0.9);
        this.progressBarBg.setStrokeStyle(2, 0x374151);
        this.progressBarBg.setDepth(1);
        
        // Barra de progresso com gradiente (simulado com múltiplas camadas)
        // Camada de brilho (gradiente superior)
        this.progressBarGlow = this.add.rectangle(progressBarX - progressBarWidth/2, progressBarY, 0, progressBarHeight, 0x06B6D4, 0.6);
        this.progressBarGlow.setOrigin(0, 0.5);
        this.progressBarGlow.setDepth(3);
        
        // Barra principal
        this.progressBar = this.add.rectangle(progressBarX - progressBarWidth/2, progressBarY, 0, progressBarHeight - 4, 0x06B6D4);
        this.progressBar.setOrigin(0, 0.5);
        this.progressBar.setDepth(2);
        
        // Barra de destaque (efeito de brilho interno)
        this.progressBarHighlight = this.add.rectangle(progressBarX - progressBarWidth/2, progressBarY - 2, 0, 3, 0x67E8F9, 0.8);
        this.progressBarHighlight.setOrigin(0, 0.5);
        this.progressBarHighlight.setDepth(4);
        
        // Texto de porcentagem
        this.progressText = this.add.text(progressBarX + progressBarWidth/2 + 10, progressBarY, '0%', {
            fontSize: '14px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#9CA3AF'
        });
        this.progressText.setOrigin(0, 0.5);
        this.progressText.setDepth(5);
    }
    
    
    carregarPergunta() {
        const { width, height } = this.cameras.main;
        
        // Limpar pergunta anterior com fade out simples
        if (this.perguntaContainer) {
            this.tweens.add({
                targets: this.perguntaContainer,
                alpha: 0,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    this.perguntaContainer.destroy();
                    // Limpar botões anteriores
                    this.botoesAlternativas.forEach(btn => {
                        if (btn && btn.container) {
                            btn.container.destroy();
                        }
                    });
                    this.loadNewQuestion(width, height);
                }
            });
        } else {
            // Primeira pergunta - carregar direto
            this.loadNewQuestion(width, height);
        }
    }
    
    loadNewQuestion(width, height) {
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
        this.perguntaContainer.setAlpha(0);
        
        // Card da pergunta
        const cardShadow = this.add.rectangle(0, -98, width * 0.8, 200, 0x000000, 0.3);
        const cardBg = this.add.rectangle(0, -100, width * 0.8, 200, 0x1E293B, 0.95);
        cardBg.setStrokeStyle(3, 0x2563EB);
        
        // Texto da pergunta
        const textoPergunta = this.add.text(0, -100, this.perguntaAtual.enunciado, {
            fontSize: '26px',
            fontFamily: 'Inter',
            fontWeight: '700',
            color: '#FFFFFF',
            wordWrap: { width: width * 0.75 },
            align: 'center',
            lineSpacing: 8
        });
        textoPergunta.setOrigin(0.5);
        
        this.perguntaContainer.add([cardShadow, cardBg, textoPergunta]);
        
        // Alternativas
        const startY = 80;
        const spacing = 90;
        
        this.perguntaAtual.alternativas.forEach((alternativa, index) => {
            const y = startY + (index * spacing);
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            
            // Criar botão customizado com letra destacada
            this.createAlternativeButton(width / 2, height / 2 + y, letter, alternativa, index, width * 0.75);
        });
        
        // Atualizar HUD
        this.atualizarHUD();
        
        // Animação de entrada simples e suave
        this.tweens.add({
            targets: this.perguntaContainer,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Animar botões entrando com delay pequeno
        this.botoesAlternativas.forEach((btn, index) => {
            if (btn && btn.container) {
                btn.container.setAlpha(0);
                this.tweens.add({
                    targets: btn.container,
                    alpha: 1,
                    duration: 300,
                    delay: 100 + (index * 50),
                    ease: 'Power2'
                });
            }
        });
    }
    
    atualizarHUD() {
        const total = this.gameData.perguntas.length;
        const atual = this.gameData.perguntaAtual + 1;
        
        this.textPontuacao.setText(`Pontos: ${this.gameData.pontuacao}`);
        this.textProgresso.setText(`Pergunta ${atual}/${total}`);
        
        const progresso = atual / total;
        const progressBarWidth = 250;
        const progressBarHeight = 12;
        const newWidth = progresso * progressBarWidth;
        const porcentagem = Math.round(progresso * 100);
        
        // Atualizar porcentagem
        this.progressText.setText(`${porcentagem}%`);
        
        // Animação suave da barra principal
        this.tweens.add({
            targets: this.progressBar,
            width: newWidth,
            duration: 500,
            ease: 'Power2'
        });
        
        // Animação da camada de brilho (ligeiramente mais rápida para efeito)
        this.tweens.add({
            targets: this.progressBarGlow,
            width: newWidth,
            duration: 400,
            ease: 'Power2'
        });
        
        // Animação do destaque interno
        this.tweens.add({
            targets: this.progressBarHighlight,
            width: newWidth * 0.8, // 80% da largura para efeito de gradiente
            duration: 450,
            ease: 'Power2'
        });
        
        // Efeito de pulso quando completa uma pergunta
        if (progresso > 0) {
            this.tweens.add({
                targets: [this.progressBar, this.progressBarGlow],
                scaleY: 1.2,
                duration: 150,
                yoyo: true,
                ease: 'Power2'
            });
        }
        
        // Mudança de cor baseada no progresso
        let barColor = 0x06B6D4; // Azul ciano padrão
        let glowColor = 0x06B6D4;
        
        if (progresso >= 0.8) {
            barColor = 0x10B981; // Verde quando quase completo
            glowColor = 0x34D399;
        } else if (progresso >= 0.5) {
            barColor = 0x3B82F6; // Azul médio
            glowColor = 0x60A5FA;
        }
        
        this.tweens.add({
            targets: this.progressBar,
            fillColor: barColor,
            duration: 300
        });
        
        this.tweens.add({
            targets: this.progressBarGlow,
            fillColor: glowColor,
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
                targets: [botaoClicado.bg, botaoClicado.letterCircle],
                tint: 0x10B981,
                fillColor: 0x10B981,
                duration: 300
            });
            this.tweens.add({
                targets: botaoClicado.letterText,
                tint: 0xFFFFFF,
                duration: 300
            });
            
            // Efeito de partículas
            this.createSuccessEffect(botaoClicado.container.x, botaoClicado.container.y);
        } else {
            // Errado - vermelho
            this.tweens.add({
                targets: [botaoClicado.bg, botaoClicado.letterCircle],
                tint: 0xEF4444,
                fillColor: 0xEF4444,
                duration: 300
            });
            
            // Destacar resposta correta
            this.tweens.add({
                targets: [botaoCorreto.bg, botaoCorreto.letterCircle],
                tint: 0x10B981,
                fillColor: 0x10B981,
                duration: 300
            });
            this.tweens.add({
                targets: botaoCorreto.letterText,
                tint: 0xFFFFFF,
                duration: 300
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
    
    createAlternativeButton(x, y, letter, text, index, width) {
        const buttonContainer = this.add.container(x, y);
        
        // Sombra do botão
        const shadow = this.add.rectangle(0, 2, width, 70, 0x000000, 0.2);
        shadow.setDepth(0);
        
        // Background do botão
        const bg = this.add.rectangle(0, 0, width, 70, 0x1E293B, 0.95);
        bg.setStrokeStyle(2, 0x374151);
        bg.setInteractive({ useHandCursor: true });
        bg.setDepth(1);
        
        // Círculo destacado para a letra com gradiente (simulado)
        const letterCircleSize = 52;
        
        // Círculo de fundo (mais escuro)
        const letterCircleBg = this.add.circle(-width/2 + 45, 0, letterCircleSize/2, 0x1E3A8A);
        letterCircleBg.setDepth(2);
        
        // Círculo principal com gradiente (simulado com círculo menor)
        const letterCircle = this.add.circle(-width/2 + 45, 0, letterCircleSize/2 - 2, 0x2563EB);
        letterCircle.setStrokeStyle(2, 0x06B6D4);
        letterCircle.setDepth(3);
        
        // Círculo interno para efeito de profundidade
        const letterCircleInner = this.add.circle(-width/2 + 45, -2, letterCircleSize/2 - 8, 0x3B82F6, 0.4);
        letterCircleInner.setDepth(4);
        
        // Letra estilizada com sombra e destaque
        const letterText = this.add.text(-width/2 + 45, 0, letter, {
            fontSize: '32px',
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#FFFFFF',
            stroke: '#0EA5E9',
            strokeThickness: 3,
            shadow: {
                offsetX: 0,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                stroke: true,
                fill: true
            }
        });
        letterText.setOrigin(0.5);
        letterText.setDepth(5);
        
        // Texto da alternativa (sem a letra, já que está no círculo)
        const alternativeText = this.add.text(-width/2 + 100, 0, text, {
            fontSize: '20px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#FFFFFF',
            wordWrap: { width: width - 150 },
            align: 'left'
        });
        alternativeText.setOrigin(0, 0.5);
        alternativeText.setDepth(2);
        
        buttonContainer.add([shadow, bg, letterCircleBg, letterCircle, letterCircleInner, letterText, alternativeText]);
        
        // Interações
        bg.on('pointerover', () => {
            this.tweens.add({
                targets: bg,
                scaleX: 1.02,
                scaleY: 1.02,
                tint: 0x3B82F6,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        bg.on('pointerout', () => {
            this.tweens.add({
                targets: bg,
                scaleX: 1,
                scaleY: 1,
                tint: 0x1E293B,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        bg.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.98,
                scaleY: 0.98,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
            
            this.time.delayedCall(100, () => {
                this.responderPergunta(index);
            });
        });
        
        // Armazenar referências para feedback visual
        const buttonData = {
            container: buttonContainer,
            bg: bg,
            letterCircleBg: letterCircleBg,
            letterCircle: letterCircle,
            letterCircleInner: letterCircleInner,
            letterText: letterText,
            alternativeText: alternativeText,
            shadow: shadow
        };
        
        this.botoesAlternativas.push(buttonData);
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

