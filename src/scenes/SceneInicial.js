import Phaser from '../utils/phaser.js';
import { Button } from '../ui/Button.js';
import { GameData } from '../utils/GameData.js';

/**
 * Cena inicial do jogo
 * Apresenta o título com elemento 3D integrado e menu de navegação
 */
export class SceneInicial extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneInicial' });
        this.popupElements = null;
        this.gameData = new GameData();
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Limpar qualquer input órfão que possa ter ficado
        this.cleanupOrphanInputs();
        
        // Ocultar renderer 3D
        if (window.threeRenderer) {
            window.threeRenderer.setVisible(false);
        }
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.style.display = 'none';
        }
        
        // Background escuro
        this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
        
        // Partículas de fundo
        this.createParticles();
        
        // Título principal 2D
        const titulo = this.add.text(width / 2, height * 0.25, 'QUÍMICA EM AÇÃO', {
            fontSize: '64px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#FFFFFF',
            stroke: '#06B6D4',
            strokeThickness: 4,
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
        
        // Subtítulo
        const subtitulo = this.add.text(width / 2, height * 0.35, 'Aprenda Química de Forma Interativa', {
            fontSize: '20px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: '#9CA3AF'
        });
        subtitulo.setOrigin(0.5);
        
        // Botões de navegação
        const buttonY = height * 0.55;
        const buttonSpacing = 80;
        
        const btnJogar = new Button(
            this,
            width / 2,
            buttonY,
            'JOGAR',
            () => this.scene.start('SceneJogo'),
            {
                backgroundColor: 0x2563EB,
                hoverColor: 0x06B6D4,
                width: 350,
                height: 70
            }
        );
        
        const btnLaboratorio = new Button(
            this,
            width / 2,
            buttonY + buttonSpacing,
            'LABORATÓRIO 3D',
            () => this.scene.start('Scene3D'),
            {
                backgroundColor: 0x8B5CF6,
                hoverColor: 0xA78BFA,
                width: 350,
                height: 70
            }
        );
        
        const btnConfig = new Button(
            this,
            width / 2,
            buttonY + buttonSpacing * 2,
            'CONFIGURAÇÕES',
            () => this.scene.start('SceneConfiguracoes'),
            {
                backgroundColor: 0x4B5563,
                hoverColor: 0x6B7280,
                width: 350,
                height: 70
            }
        );
        
        const btnCreditos = new Button(
            this,
            width / 2,
            buttonY + buttonSpacing * 3,
            'CRÉDITOS',
            () => this.scene.start('SceneCreditos'),
            {
                backgroundColor: 0x4B5563,
                hoverColor: 0x6B7280,
                width: 350,
                height: 70
            }
        );
        
        // Efeito de entrada
        this.cameras.main.fadeIn(300);
        
        // Sempre mostrar popup para permitir editar o nome (sem delay)
        // A mensagem de boas-vindas só aparecerá após o popup ser fechado
        this.showNomePopup();
    }
    
    cleanupOrphanInputs() {
        // Remover qualquer input órfão que possa ter ficado
        const orphanInput = document.getElementById('nome-input-popup');
        if (orphanInput && orphanInput.parentNode) {
            orphanInput.removeEventListener('keypress', () => {});
            document.body.removeChild(orphanInput);
        }
    }
    
    async showNomePopup() {
        const { width, height } = this.cameras.main;
        
        // Limpar inputs órfãos antes de criar novo
        this.cleanupOrphanInputs();
        
        // Carregar nome salvo se existir
        const nomeSalvo = this.gameData.getNomeJogador();
        
        // Desabilitar eventos do canvas temporariamente
        const gameCanvas = document.querySelector('canvas');
        if (gameCanvas) {
            gameCanvas.style.pointerEvents = 'none';
        }
        
        // Overlay escuro
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setDepth(1000);
        
        // Card do popup
        const cardBg = this.add.rectangle(width / 2, height / 2, 500, 300, 0x1E293B, 0.95);
        cardBg.setStrokeStyle(3, 0x2563EB);
        cardBg.setDepth(1001);
        
        // Título
        const titulo = this.add.text(width / 2, height / 2 - 100, 'BEM-VINDO!', {
            fontSize: '32px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#06B6D4',
            stroke: '#2563EB',
            strokeThickness: 2
        });
        titulo.setOrigin(0.5);
        titulo.setDepth(1002);
        
        // Subtítulo (muda se já tiver nome)
        const subtituloTexto = nomeSalvo && nomeSalvo !== 'Jogador' 
            ? 'Edite seu nome ou confirme para continuar' 
            : 'Digite seu nome para começar';
        
        const subtitulo = this.add.text(width / 2, height / 2 - 50, subtituloTexto, {
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: '#9CA3AF'
        });
        subtitulo.setOrigin(0.5);
        subtitulo.setDepth(1002);
        
        // Campo de input (simulado com retângulo)
        const inputBg = this.add.rectangle(width / 2, height / 2 + 10, 400, 50, 0x0F172A, 0.9);
        inputBg.setStrokeStyle(2, 0x2563EB);
        inputBg.setInteractive({ useHandCursor: true });
        inputBg.setDepth(1001);
        
        // Texto do input
        let nomeTexto = nomeSalvo && nomeSalvo !== 'Jogador' ? nomeSalvo : '';
        const inputText = this.add.text(width / 2, height / 2 + 10, nomeTexto || 'Digite seu nome...', {
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: nomeTexto ? '#FFFFFF' : '#6B7280'
        });
        inputText.setOrigin(0.5);
        inputText.setDepth(1002);
        
        // Criar input HTML real
        const inputElement = document.createElement('input');
        inputElement.id = 'nome-input-popup';
        inputElement.type = 'text';
        inputElement.placeholder = 'Digite seu nome...';
        inputElement.value = nomeTexto; // Preencher com nome salvo
        inputElement.style.position = 'fixed';
        inputElement.style.left = '50%';
        inputElement.style.top = '50%';
        inputElement.style.transform = 'translate(-50%, -50%)';
        inputElement.style.marginTop = '10px';
        inputElement.style.width = '400px';
        inputElement.style.height = '50px';
        inputElement.style.backgroundColor = '#0F172A';
        inputElement.style.border = '2px solid #2563EB';
        inputElement.style.borderRadius = '8px';
        inputElement.style.padding = '0 15px';
        inputElement.style.color = '#FFFFFF';
        inputElement.style.fontSize = '18px';
        inputElement.style.fontFamily = 'Inter, sans-serif';
        inputElement.style.outline = 'none';
        inputElement.style.textAlign = 'center';
        inputElement.style.zIndex = '99999';
        inputElement.style.pointerEvents = 'auto';
        inputElement.style.cursor = 'text';
        inputElement.style.display = 'block';
        inputElement.maxLength = 20;
        document.body.appendChild(inputElement);
        
        // Selecionar todo o texto se já tiver nome
        setTimeout(() => {
            inputElement.focus();
            if (nomeTexto) {
                inputElement.select();
            }
        }, 100);
        
        // Atualizar texto quando digitar
        inputElement.addEventListener('input', (e) => {
            nomeTexto = e.target.value;
            if (nomeTexto.length > 0) {
                inputText.setText(nomeTexto);
                inputText.setColor('#FFFFFF');
            } else {
                inputText.setText('Digite seu nome...');
                inputText.setColor('#6B7280');
            }
        });
        
        // Armazenar referências para cleanup
        this.popupElements = {
            overlay: overlay,
            cardBg: cardBg,
            titulo: titulo,
            subtitulo: subtitulo,
            inputBg: inputBg,
            inputText: inputText,
            inputElement: inputElement
        };
        
        // Botão confirmar
        const btnConfirmar = new Button(
            this,
            width / 2,
            height / 2 + 90,
            'CONFIRMAR',
            () => {
                const nomeFinal = inputElement.value.trim() || 'Jogador';
                this.gameData.saveNomeJogador(nomeFinal);
                
                // Limpar popup completamente
                this.cleanupPopup();
                
                // Mostrar mensagem de boas-vindas
                this.showWelcomeMessage(nomeFinal, true);
            },
            {
                backgroundColor: 0x2563EB,
                hoverColor: 0x06B6D4,
                width: 200,
                height: 50,
                fontSize: '18px'
            }
        );
        btnConfirmar.container.setDepth(1002);
        this.popupElements.btnConfirmar = btnConfirmar;
        
        // Permitir Enter para confirmar
        const onEnterKey = (e) => {
            if (e.key === 'Enter') {
                const nomeFinal = inputElement.value.trim() || 'Jogador';
                this.gameData.saveNomeJogador(nomeFinal);
                
                // Remover listener antes de limpar
                inputElement.removeEventListener('keypress', onEnterKey);
                
                // Limpar popup completamente
                this.cleanupPopup();
                
                // Mostrar mensagem de boas-vindas
                this.showWelcomeMessage(nomeFinal, true);
            }
        };
        inputElement.addEventListener('keypress', onEnterKey);
        this.popupElements.onEnterKey = onEnterKey;
    }
    
    cleanupPopup() {
        // Reabilitar eventos do canvas
        const gameCanvas = document.querySelector('canvas');
        if (gameCanvas) {
            gameCanvas.style.pointerEvents = 'auto';
        }
        
        // Remover todos os elementos do popup
        if (this.popupElements) {
            // Remover input HTML primeiro
            if (this.popupElements.inputElement) {
                try {
                    if (this.popupElements.onEnterKey) {
                        this.popupElements.inputElement.removeEventListener('keypress', this.popupElements.onEnterKey);
                    }
                    // Esconder o input antes de remover
                    this.popupElements.inputElement.style.display = 'none';
                    if (this.popupElements.inputElement.parentNode) {
                        document.body.removeChild(this.popupElements.inputElement);
                    }
                } catch (e) {
                    console.warn('Erro ao remover input:', e);
                }
            }
            
            // Destruir elementos Phaser
            if (this.popupElements.overlay) this.popupElements.overlay.destroy();
            if (this.popupElements.cardBg) this.popupElements.cardBg.destroy();
            if (this.popupElements.titulo) this.popupElements.titulo.destroy();
            if (this.popupElements.subtitulo) this.popupElements.subtitulo.destroy();
            if (this.popupElements.inputBg) this.popupElements.inputBg.destroy();
            if (this.popupElements.inputText) this.popupElements.inputText.destroy();
            if (this.popupElements.btnConfirmar) {
                if (this.popupElements.btnConfirmar.container) {
                    this.popupElements.btnConfirmar.container.destroy();
                }
                if (this.popupElements.btnConfirmar.destroy) {
                    this.popupElements.btnConfirmar.destroy();
                }
            }
            
            this.popupElements = null;
        }
        
        // Limpar inputs órfãos também
        this.cleanupOrphanInputs();
    }
    
    showWelcomeMessage(nome, animate = true) {
        const { width, height } = this.cameras.main;
        
        // Remover mensagem anterior se existir
        const existingWelcome = this.children.getByName('welcomeMessage');
        if (existingWelcome) {
            existingWelcome.destroy();
        }
        
        const welcomeText = this.add.text(width / 2, height * 0.15, `Olá, ${nome}!`, {
            fontSize: '24px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#06B6D4'
        });
        welcomeText.setOrigin(0.5);
        welcomeText.setName('welcomeMessage');
        
        if (animate) {
            welcomeText.setAlpha(0);
            this.tweens.add({
                targets: welcomeText,
                alpha: 1,
                y: welcomeText.y - 20,
                duration: 500,
                ease: 'Power2'
            });
            
            // Fazer desaparecer após 3 segundos
            this.tweens.add({
                targets: welcomeText,
                alpha: 0,
                delay: 3000,
                duration: 500,
                onComplete: () => welcomeText.destroy()
            });
        } else {
            welcomeText.setAlpha(1);
        }
    }
    
    createParticles() {
        // Criar partículas simples para efeito visual
        const particles = this.add.particles(0, 0, 'particle', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            lifespan: 3000,
            frequency: 200,
            tint: [0x2563EB, 0x06B6D4, 0x8B5CF6]
        });
        
        // Criar partícula básica se não existir
        if (!this.textures.exists('particle')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(0, 0, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }
        
        // Emitir partículas em posições aleatórias
        this.time.addEvent({
            delay: 200,
            callback: () => {
                const x = Phaser.Math.Between(0, this.cameras.main.width);
                const y = Phaser.Math.Between(0, this.cameras.main.height);
                particles.emitParticleAt(x, y);
            },
            loop: true
        });
    }
    
    shutdown() {
        // Limpeza ao sair da cena
        this.cleanupPopup();
        this.cleanupOrphanInputs();
    }
}

