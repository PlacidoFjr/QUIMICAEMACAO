// Exportar Phaser para uso em todas as cenas
import * as PhaserModule from 'phaser';

// O Phaser ESM pode exportar de diferentes formas
// Tentamos acessar o default primeiro, senão usamos o módulo inteiro
let Phaser = PhaserModule.default || PhaserModule;

// Se ainda não funcionar, tentamos acessar diretamente do namespace
if (!Phaser || !Phaser.Scene) {
    // O Phaser pode estar exportado diretamente no namespace
    Phaser = PhaserModule;
}

// Exportar o Phaser
export default Phaser;
export { Phaser };

