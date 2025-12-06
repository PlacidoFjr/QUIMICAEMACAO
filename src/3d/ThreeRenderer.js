import * as THREE from 'three';

/**
 * Renderer 3D para elemento visual na tela inicial
 * Cria texto 3D "QUÍMICA EM AÇÃO" com rotação suave e iluminação elegante
 */
export class ThreeRenderer {
    constructor(containerId = 'three-container') {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.textGroup = null;
        this.animationId = null;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('Container three-container não encontrado!');
            return;
        }
        
        // Criar cena
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparente
        
        // Câmera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 12);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Garantir que o canvas seja visível
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.zIndex = '2';
        this.renderer.domElement.style.display = 'block';
        
        this.container.appendChild(this.renderer.domElement);
        
        // Garantir que o container também esteja visível
        if (this.container) {
            this.container.style.display = 'block';
            this.container.style.zIndex = '2';
        }
        
        // Iluminação
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        this.scene.add(ambientLight);
        
        const directionalLight1 = new THREE.DirectionalLight(0x06B6D4, 1.2);
        directionalLight1.position.set(5, 5, 5);
        directionalLight1.castShadow = true;
        this.scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0x2563EB, 0.8);
        directionalLight2.position.set(-5, 3, 5);
        this.scene.add(directionalLight2);
        
        const pointLight = new THREE.PointLight(0x8B5CF6, 0.6);
        pointLight.position.set(0, 0, 10);
        this.scene.add(pointLight);
        
        // Criar texto 3D
        this.createText3D();
        
        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        
        this.isActive = true;
        this.animate();
    }
    
    createText3D() {
        const textGroup = new THREE.Group();
        const text = 'QUÍMICA EM AÇÃO';
        const letters = text.split('');
        
        let letterIndex = 0; // Contador apenas para letras (ignora espaços)
        
        // Criar cada letra como um plano 3D com textura
        letters.forEach((char, index) => {
            if (char === ' ') {
                // Espaço - apenas avançar posição
                return;
            }
            
            // Criar canvas para renderizar a letra
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 512;
            
            // Desenhar letra no canvas com gradiente
            const gradient = context.createLinearGradient(0, 0, 512, 512);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.5, '#06B6D4');
            gradient.addColorStop(1, '#2563EB');
            
            context.fillStyle = gradient;
            context.font = 'bold 320px Inter, Arial, sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            // Adicionar stroke
            context.strokeStyle = '#06B6D4';
            context.lineWidth = 8;
            context.strokeText(char, 256, 256);
            context.fillText(char, 256, 256);
            
            // Criar textura do canvas
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            
            // Criar geometria com extrusão para efeito 3D game-like
            const planeGeometry = new THREE.PlaneGeometry(1.4, 1.4);
            
            // Criar material com emissão para brilho game-like
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x06B6D4,
                emissiveIntensity: 0.8,
                metalness: 0.9,
                roughness: 0.1,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            // Criar mesh principal
            const mesh = new THREE.Mesh(planeGeometry, material);
            
            // Adicionar glow effect com plano adicional atrás
            const glowGeometry = new THREE.PlaneGeometry(1.6, 1.6);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x06B6D4,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.z = -0.1;
            mesh.add(glow);
            
            // Posicionar letras em linha (usando letterIndex para espaçamento correto)
            const spacing = 1.4;
            const totalLetters = letters.filter(c => c !== ' ').length;
            const totalWidth = (totalLetters - 1) * spacing;
            const startX = -totalWidth / 2;
            
            mesh.position.x = startX + letterIndex * spacing;
            mesh.position.y = 0;
            mesh.position.z = 0;
            
            // Adicionar borda brilhante (sem emissive, pois LineBasicMaterial não suporta)
            const edgeGeometry = new THREE.EdgesGeometry(planeGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: 0x06B6D4,
                linewidth: 4
            });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            mesh.add(edges);
            
            textGroup.add(mesh);
            letterIndex++;
        });
        
        this.textGroup = textGroup;
        this.scene.add(this.textGroup);
        
        // Posicionar texto no topo da tela (~15% da altura)
        // Converter coordenada de tela para 3D
        const screenYPercent = 0.15; // 15% do topo
        const fov = this.camera.fov * (Math.PI / 180);
        const aspect = window.innerWidth / window.innerHeight;
        const cameraZ = 25; // Distância fixa da câmera
        const worldY = (0.5 - screenYPercent) * 2 * Math.tan(fov / 2) * cameraZ;
        
        textGroup.position.set(0, worldY, 0);
        this.camera.position.set(0, worldY, cameraZ);
        this.camera.lookAt(0, worldY, 0);
        
        // Renderizar imediatamente
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        // Ajustar posição após um frame (quando bounding box estiver pronto)
        requestAnimationFrame(() => {
            try {
                const box = new THREE.Box3().setFromObject(textGroup);
                const size = box.getSize(new THREE.Vector3());
                
                if (size.x > 0 && size.y > 0) {
                    const maxDim = Math.max(size.x, size.y, 1);
                    let newCameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                    newCameraZ = Math.max(newCameraZ * 1.3, 20);
                    
                    const newWorldY = (0.5 - screenYPercent) * 2 * Math.tan(fov / 2) * newCameraZ;
                    
                    this.camera.position.set(0, newWorldY, newCameraZ);
                    this.camera.lookAt(0, newWorldY, 0);
                    this.renderer.render(this.scene, this.camera);
                }
            } catch (error) {
                // Manter valores padrão
            }
        });
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.textGroup && this.renderer && this.camera) {
            // Rotação suave do texto (mais sutil)
            this.textGroup.rotation.y += 0.002;
            this.textGroup.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05;
            
            // Animar letras individualmente (efeito de onda mais suave)
            this.textGroup.children.forEach((child, index) => {
                if (child instanceof THREE.Mesh) {
                    const time = Date.now() * 0.001;
                    const baseY = child.userData.baseY || 0;
                    if (!child.userData.baseY) {
                        child.userData.baseY = 0;
                    }
                    // Movimento mais sutil
                    child.position.y = baseY + Math.sin(time * 1.5 + index * 0.2) * 0.05;
                    child.rotation.z = Math.sin(time * 1.2 + index * 0.15) * 0.03;
                }
            });
            
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    setVisible(visible) {
        if (this.container) {
            this.container.style.display = visible ? 'block' : 'none';
        }
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.style.display = visible ? 'block' : 'none';
        }
        this.isActive = visible;
        if (visible) {
            if (!this.animationId) {
                this.animate();
            }
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } else {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
    }
    
    destroy() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement.parentNode) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
    }
}

