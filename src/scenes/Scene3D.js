import Phaser from '../utils/phaser.js';
import * as THREE from 'three';

/**
 * Cena do Laboratório 3D Interativo
 * Visualização de modelos moleculares em 3D
 */
export class Scene3D extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3D' });
        this.threeScene = null;
        this.camera = null;
        this.renderer = null;
        this.modeloAtual = null;
        this.controls = {
            isDragging: false,
            lastMouseX: 0,
            lastMouseY: 0,
            rotationX: 0,
            rotationY: 0,
            zoom: 5
        };
        this.animationFrameId = null;
        this.resizeHandler = null;
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Ocultar renderer 3D principal
        if (window.threeRenderer) {
            window.threeRenderer.setVisible(false);
        }
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.style.display = 'none';
        }
        
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
        
        // Título
        const titulo = this.add.text(width / 2, 50, 'LABORATÓRIO 3D', {
            fontSize: '36px',
            fontFamily: 'Inter',
            fontWeight: '800',
            color: '#FFFFFF'
        });
        titulo.setOrigin(0.5);
        titulo.setDepth(100);
        
        // Botão voltar
        const btnVoltar = this.add.text(30, 30, '← VOLTAR', {
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: '600',
            color: '#06B6D4'
        });
        btnVoltar.setInteractive({ useHandCursor: true });
        btnVoltar.setDepth(100);
        btnVoltar.on('pointerdown', () => {
            this.cleanup();
            this.scene.start('SceneInicial');
        });
        
        // Botões de modelo
        this.createModelButtons();
        
        // Instruções
        const instrucoes = this.add.text(width / 2, 210, 'Arraste para rotacionar | Scroll para zoom', {
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: '400',
            color: '#9CA3AF'
        });
        instrucoes.setOrigin(0.5);
        instrucoes.setDepth(100);
        
        // Criar container para Three.js
        this.createThreeContainer();
    }
    
    createThreeContainer() {
        // Remover container anterior se existir
        const oldContainer = document.getElementById('lab-3d-container');
        if (oldContainer) {
            oldContainer.remove();
        }
        
        // Criar novo container
        const container = document.createElement('div');
        container.id = 'lab-3d-container';
        container.style.cssText = `
            position: fixed;
            top: 240px;
            left: 0;
            width: 100%;
            height: calc(100% - 240px);
            z-index: 5;
            pointer-events: auto;
            background-color: #0F172A;
        `;
        document.body.appendChild(container);
        
        // Inicializar Three.js
        this.initThreeJS(container);
    }
    
    initThreeJS(container) {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        // Cena
        this.threeScene = new THREE.Scene();
        this.threeScene.background = new THREE.Color(0x0F172A);
        
        // Câmera
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = this.controls.zoom;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
        
        // Iluminação
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.threeScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.threeScene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x06B6D4, 0.5);
        pointLight.position.set(-5, 3, 5);
        this.threeScene.add(pointLight);
        
        // Controles
        this.setupControls();
        
        // Carregar modelo padrão
        this.carregarModelo('agua');
        
        // Animação
        this.animate();
        
        // Resize handler
        this.resizeHandler = () => this.onWindowResize();
        window.addEventListener('resize', this.resizeHandler);
    }
    
    setupControls() {
        const container = document.getElementById('lab-3d-container');
        if (!container) return;
        
        const canvas = this.renderer.domElement;
        
        // Mouse drag
        canvas.addEventListener('mousedown', (e) => {
            this.controls.isDragging = true;
            this.controls.lastMouseX = e.clientX;
            this.controls.lastMouseY = e.clientY;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!this.controls.isDragging) return;
            
            const deltaX = e.clientX - this.controls.lastMouseX;
            const deltaY = e.clientY - this.controls.lastMouseY;
            
            this.controls.rotationY += deltaX * 0.01;
            this.controls.rotationX += deltaY * 0.01;
            
            this.controls.lastMouseX = e.clientX;
            this.controls.lastMouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            this.controls.isDragging = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.controls.isDragging = false;
        });
        
        // Wheel zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.controls.zoom += e.deltaY * 0.01;
            this.controls.zoom = Math.max(3, Math.min(15, this.controls.zoom));
            this.camera.position.z = this.controls.zoom;
        });
    }
    
    createModelButtons() {
        const { width } = this.cameras.main;
        const models = [
            { id: 'agua', nome: 'Água (H₂O)', formula: 'H₂O' },
            { id: 'co2', nome: 'Dióxido de Carbono', formula: 'CO₂' },
            { id: 'metano', nome: 'Metano', formula: 'CH₄' },
            { id: 'amonia', nome: 'Amônia', formula: 'NH₃' },
            { id: 'etanol', nome: 'Etanol', formula: 'C₂H₅OH' },
            { id: 'etileno', nome: 'Etileno', formula: 'C₂H₄' }
        ];
        
        const startX = width / 2 - (models.length * 120) / 2 + 60;
        const buttonY = 150;
        
        this.modelButtons = [];
        
        models.forEach((model, index) => {
            const btn = this.add.rectangle(startX + index * 120, buttonY, 110, 50, 0x1E293B, 0.9);
            btn.setStrokeStyle(2, 0x2563EB);
            btn.setInteractive({ useHandCursor: true });
            btn.setDepth(100);
            
            const btnText = this.add.text(startX + index * 120, buttonY - 8, model.formula, {
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '700',
                color: '#FFFFFF'
            });
            btnText.setOrigin(0.5);
            btnText.setDepth(101);
            
            const btnNome = this.add.text(startX + index * 120, buttonY + 12, model.nome.split(' ')[0], {
                fontSize: '10px',
                fontFamily: 'Inter',
                fontWeight: '400',
                color: '#9CA3AF'
            });
            btnNome.setOrigin(0.5);
            btnNome.setDepth(101);
            
            btn.on('pointerdown', () => {
                this.carregarModelo(model.id);
                // Atualizar seleção visual
                this.modelButtons.forEach(b => {
                    b.setStrokeStyle(2, 0x2563EB);
                    b.setFillStyle(0x1E293B, 0.9);
                });
                btn.setStrokeStyle(3, 0x06B6D4);
                btn.setFillStyle(0x2563EB, 0.7);
            });
            
            btn.on('pointerover', () => {
                if (btn.strokeColor !== 0x06B6D4) {
                    btn.setFillStyle(0x2563EB, 0.5);
                }
            });
            
            btn.on('pointerout', () => {
                if (btn.strokeColor !== 0x06B6D4) {
                    btn.setFillStyle(0x1E293B, 0.9);
                }
            });
            
            this.modelButtons.push(btn);
        });
    }
    
    carregarModelo(tipo) {
        // Remover modelo anterior
        if (this.modeloAtual) {
            this.threeScene.remove(this.modeloAtual);
            if (this.modeloAtual.children) {
                this.modeloAtual.children.forEach(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => m.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
        }
        
        const grupo = new THREE.Group();
        
        // Definir modelos
        const modelos = {
            agua: {
                atomos: [
                    { tipo: 'O', pos: [0, 0, 0], cor: 0xFF0000 },
                    { tipo: 'H', pos: [0.76, 0.5, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-0.76, 0.5, 0], cor: 0xFFFFFF }
                ],
                ligacoes: [
                    [0, 1], [0, 2]
                ]
            },
            co2: {
                atomos: [
                    { tipo: 'C', pos: [0, 0, 0], cor: 0x333333 },
                    { tipo: 'O', pos: [-1.16, 0, 0], cor: 0xFF0000 },
                    { tipo: 'O', pos: [1.16, 0, 0], cor: 0xFF0000 }
                ],
                ligacoes: [
                    [0, 1], [0, 2]
                ]
            },
            metano: {
                atomos: [
                    { tipo: 'C', pos: [0, 0, 0], cor: 0x333333 },
                    { tipo: 'H', pos: [0.63, 0.63, 0.63], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-0.63, 0.63, -0.63], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [0.63, -0.63, -0.63], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-0.63, -0.63, 0.63], cor: 0xFFFFFF }
                ],
                ligacoes: [
                    [0, 1], [0, 2], [0, 3], [0, 4]
                ]
            },
            amonia: {
                atomos: [
                    { tipo: 'N', pos: [0, 0.4, 0], cor: 0x0000FF },
                    { tipo: 'H', pos: [0.94, -0.31, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-0.47, -0.31, 0.82], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-0.47, -0.31, -0.82], cor: 0xFFFFFF }
                ],
                ligacoes: [
                    [0, 1], [0, 2], [0, 3]
                ]
            },
            etanol: {
                atomos: [
                    { tipo: 'C', pos: [-0.7, 0, 0], cor: 0x333333 },
                    { tipo: 'C', pos: [0.7, 0, 0], cor: 0x333333 },
                    { tipo: 'O', pos: [1.4, 0, 0], cor: 0xFF0000 },
                    { tipo: 'H', pos: [-1.1, 0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-1.1, -0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-0.4, 0, 0.9], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [0.4, 0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [0.4, -0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [1.6, 0.5, 0], cor: 0xFFFFFF }
                ],
                ligacoes: [
                    [0, 1], [1, 2], [0, 3], [0, 4], [0, 5], [1, 6], [1, 7], [2, 8]
                ]
            },
            etileno: {
                atomos: [
                    { tipo: 'C', pos: [-0.67, 0, 0], cor: 0x333333 },
                    { tipo: 'C', pos: [0.67, 0, 0], cor: 0x333333 },
                    { tipo: 'H', pos: [-1.24, 0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [-1.24, -0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [1.24, 0.9, 0], cor: 0xFFFFFF },
                    { tipo: 'H', pos: [1.24, -0.9, 0], cor: 0xFFFFFF }
                ],
                ligacoes: [
                    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5]
                ]
            }
        };
        
        const modelo = modelos[tipo];
        if (!modelo) return;
        
        // Criar átomos
        modelo.atomos.forEach(atom => {
            const geometry = new THREE.SphereGeometry(0.3, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: atom.cor,
                metalness: 0.3,
                roughness: 0.7,
                emissive: atom.cor,
                emissiveIntensity: 0.2
            });
            const esfera = new THREE.Mesh(geometry, material);
            esfera.position.set(...atom.pos);
            esfera.castShadow = true;
            esfera.receiveShadow = true;
            grupo.add(esfera);
        });
        
        // Criar ligações
        modelo.ligacoes.forEach(lig => {
            const a1 = modelo.atomos[lig[0]];
            const a2 = modelo.atomos[lig[1]];
            
            const start = new THREE.Vector3(...a1.pos);
            const end = new THREE.Vector3(...a2.pos);
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, length, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0xCCCCCC,
                metalness: 0.5,
                roughness: 0.5
            });
            const cilindro = new THREE.Mesh(geometry, material);
            
            const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            cilindro.position.copy(midPoint);
            cilindro.lookAt(end);
            cilindro.rotateX(Math.PI / 2);
            
            grupo.add(cilindro);
        });
        
        this.modeloAtual = grupo;
        this.threeScene.add(grupo);
        this.controls.rotationX = 0;
        this.controls.rotationY = 0;
    }
    
    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        if (this.modeloAtual && this.renderer && this.camera) {
            this.modeloAtual.rotation.x = this.controls.rotationX;
            this.modeloAtual.rotation.y = this.controls.rotationY;
            
            this.renderer.render(this.threeScene, this.camera);
        }
    }
    
    onWindowResize() {
        const container = document.getElementById('lab-3d-container');
        if (!container || !this.camera || !this.renderer) return;
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    cleanup() {
        // Parar animação
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remover event listeners
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        
        // Limpar Three.js
        if (this.modeloAtual) {
            this.threeScene.remove(this.modeloAtual);
            this.modeloAtual.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            this.modeloAtual = null;
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            const container = document.getElementById('lab-3d-container');
            if (container && this.renderer.domElement.parentNode) {
                container.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }
        
        // Remover container
        const container = document.getElementById('lab-3d-container');
        if (container) {
            container.remove();
        }
        
        // Restaurar renderer 3D principal
        if (window.threeRenderer) {
            window.threeRenderer.setVisible(true);
        }
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.style.display = 'block';
        }
    }
    
    shutdown() {
        this.cleanup();
    }
}

