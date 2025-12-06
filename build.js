const fs = require('fs');
const path = require('path');

// Criar diretório public se não existir
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Função para copiar arquivos recursivamente
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            // Ignorar node_modules e .git
            if (childItemName === 'node_modules' || childItemName === '.git' || childItemName === 'public') {
                return;
            }
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copiar arquivos necessários
const filesToCopy = [
    'index.html',
    'styles.css',
    'favicon.svg',
    'src',
    'data',
    'assets'
];

console.log('Building for Vercel...');

filesToCopy.forEach(item => {
    const srcPath = path.join(__dirname, item);
    const destPath = path.join(publicDir, item);
    
    if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, destPath);
        console.log(`✓ Copied ${item}`);
    }
});

console.log('Build completed! Files are in the public/ directory.');

