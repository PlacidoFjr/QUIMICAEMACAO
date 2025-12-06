import Phaser from './utils/phaser.js';
import { SceneInicial } from './scenes/SceneInicial.js';
import { SceneJogo } from './scenes/SceneJogo.js';
import { SceneResultado } from './scenes/SceneResultado.js';
import { Scene3D } from './scenes/Scene3D.js';
import { SceneConfiguracoes } from './scenes/SceneConfiguracoes.js';
import { SceneCreditos } from './scenes/SceneCreditos.js';

// Configuração do jogo Phaser
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: 'transparent',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: SceneInicial,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    audio: {
        disableWebAudio: true
    }
};

const container = document.getElementById('game-container');
if (!container) {
    console.error('Container #game-container não encontrado!');
    document.body.innerHTML = `
        <div style="color: white; padding: 20px; text-align: center; font-family: Arial;">
            <h1>Erro: Container do jogo não encontrado</h1>
            <p>O elemento #game-container não existe no HTML.</p>
        </div>
    `;
}

let game;
try {
    game = new Phaser.Game(config);
    
    game.scene.add('SceneJogo', SceneJogo);
    game.scene.add('SceneResultado', SceneResultado);
    game.scene.add('Scene3D', Scene3D);
    game.scene.add('SceneConfiguracoes', SceneConfiguracoes);
    game.scene.add('SceneCreditos', SceneCreditos);
    
    window.addEventListener('load', () => {
        window.gameInstance = game;
        window.threeRenderer = null;
    });
    
    window.gameInstance = game;
} catch (error) {
    console.error('Erro ao inicializar o jogo:', error);
    document.body.innerHTML = `
        <div style="color: white; padding: 20px; text-align: center; font-family: Arial;">
            <h1>Erro ao carregar o jogo</h1>
            <p>${error.message}</p>
            <p>Verifique o console do navegador (F12) para mais detalhes.</p>
        </div>
    `;
}

export { game };

