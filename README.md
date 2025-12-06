# Química em Ação - Documentação Técnica Completa

## 📋 Visão Geral do Projeto

**Química em Ação** é um jogo educacional web interativo desenvolvido com qualidade de estúdio indie profissional, integrando elementos 2D e 3D para proporcionar uma experiência de aprendizado imersiva em química. O projeto combina Phaser 3 para a lógica de jogo 2D e Three.js para visualizações 3D interativas de modelos moleculares.

### Características Principais
- **Plataforma**: Web (HTML5)
- **Framework 2D**: Phaser 3.70.0
- **Framework 3D**: Three.js 0.158.0
- **Arquitetura**: ES Modules (ESM)
- **Persistência**: LocalStorage
- **Design**: Responsivo e moderno
- **Qualidade**: Polimento visual profissional

---

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios

```
quimica-em-acao/
├── index.html                 # Ponto de entrada HTML
├── styles.css                 # Estilos globais e variáveis CSS
├── package.json               # Dependências e scripts npm
├── package-lock.json          # Lock de versões
├── README.md                  # Documentação do projeto
├── data/
│   └── perguntas.json         # Banco de dados de perguntas (50 questões)
├── src/
│   ├── main.js                # Inicialização do Phaser e configuração
│   ├── utils/
│   │   ├── phaser.js          # Export centralizado do Phaser
│   │   └── GameData.js        # Gerenciamento de dados e persistência
│   ├── scenes/
│   │   ├── SceneInicial.js    # Tela inicial com átomo 3D
│   │   ├── SceneJogo.js        # Cena do quiz interativo
│   │   ├── SceneResultado.js   # Tela de resultados
│   │   ├── Scene3D.js          # Laboratório 3D interativo
│   │   ├── SceneConfiguracoes.js  # Tela de configurações
│   │   └── SceneCreditos.js    # Tela de créditos
│   ├── ui/
│   │   └── Button.js           # Componente de botão reutilizável
│   └── 3d/
│       └── ThreeRenderer.js    # Renderer 3D para tela inicial
└── assets/                    # Assets do jogo (sprites, modelos)
```

---

## 🎮 Cenas e Funcionalidades

### 1. SceneInicial (Tela Inicial)

**Localização**: `src/scenes/SceneInicial.js`

**Funcionalidades**:
- **Átomo 3D Estilizado**: Elemento visual Three.js com rotação suave e iluminação elegante
- **Sistema de Partículas**: Efeito de partículas de fundo para atmosfera científica
- **Popup de Nome**: Modal interativo para captura do nome do jogador
- **Navegação Principal**: Botões para acessar todas as seções do jogo
- **Animações**: Título com animação de flutuação suave

**Elementos Visuais**:
- Título "QUÍMICA EM AÇÃO" com sombra e stroke
- Subtítulo descritivo
- 4 botões principais: Jogar, Laboratório 3D, Configurações, Créditos
- Efeito de fade-in na entrada da cena

**Integração 3D**:
- Renderer Three.js independente (`ThreeRenderer.js`)
- Átomo com núcleo e elétrons orbitando
- Iluminação ambiente + direcional + pontual
- Material físico com metalness e roughness

### 2. SceneJogo (Quiz Interativo)

**Localização**: `src/scenes/SceneJogo.js`

**Funcionalidades**:
- **Sistema de Perguntas**: Carrega 10 perguntas aleatórias de um pool de 50
- **HUD Completo**: Barra superior com pontuação, progresso e botão voltar
- **Feedback Imediato**: Animações e cores para respostas corretas/incorretas
- **Barra de Progresso**: Indicador visual do progresso no quiz
- **Modal de Confirmação**: Diálogo ao tentar sair durante o jogo
- **Explicações**: Mostra explicação após cada resposta

**Mecânicas de Jogo**:
- Pontuação baseada em respostas corretas
- Timer opcional (configurável)
- Dificuldade adaptativa (fácil, médio, difícil)
- Persistência de progresso via LocalStorage

**UI/UX**:
- Botões de alternativas com hover effects
- Micro-animações de feedback
- Transições suaves entre perguntas
- Cores semânticas (verde=correto, vermelho=incorreto)

### 3. SceneResultado (Tela de Resultados)

**Localização**: `src/scenes/SceneResultado.js`

**Funcionalidades**:
- **Estatísticas Completas**: Pontuação, acertos, erros, porcentagem
- **Mensagem Motivacional**: Feedback baseado no desempenho
- **Ranking Visual**: Representação gráfica do desempenho
- **Opções de Ação**: Jogar novamente, ver respostas, voltar ao menu

**Elementos**:
- Card centralizado com informações
- Badges de conquistas (se implementado)
- Histórico de partidas anteriores

### 4. Scene3D (Laboratório 3D Interativo)

**Localização**: `src/scenes/Scene3D.js`

**Funcionalidades**:
- **6 Modelos Moleculares**: Água, CO₂, Metano, Amônia, Etanol, Etileno
- **Controles Interativos**: 
  - Arrastar para rotacionar
  - Scroll para zoom in/out
  - Hover para destacar elementos
- **Seleção de Modelos**: Botões visuais para trocar entre moléculas
- **Renderização em Tempo Real**: Loop de animação contínuo

**Modelos Implementados**:
1. **Água (H₂O)**: Geometria angular ~104.5°
2. **CO₂**: Estrutura linear
3. **Metano (CH₄)**: Geometria tetraédrica
4. **Amônia (NH₃)**: Pirâmide trigonal
5. **Etanol (C₂H₅OH)**: Estrutura complexa com 9 átomos
6. **Etileno (C₂H₄)**: Dupla ligação carbono-carbono

**Tecnologia 3D**:
- Three.js WebGLRenderer
- MeshStandardMaterial com propriedades físicas
- Iluminação: AmbientLight + DirectionalLight + PointLight
- Geometrias: SphereGeometry (átomos) + CylinderGeometry (ligações)
- Sistema de coordenadas 3D preciso

### 5. SceneConfiguracoes (Configurações)

**Localização**: `src/scenes/SceneConfiguracoes.js`

**Funcionalidades**:
- **Volume de Áudio**: Slider para controlar volume
- **Dificuldade**: Seletor visual (Fácil, Médio, Difícil)
- **Efeitos Sonoros**: Toggle on/off
- **Trilha Sonora**: Toggle on/off
- **Persistência**: Todas as configurações salvas em LocalStorage

**UI**:
- Toggles animados
- Sliders estilizados
- Cards de configuração organizados
- Botão de reset para padrões

### 6. SceneCreditos (Créditos)

**Localização**: `src/scenes/SceneCreditos.js`

**Funcionalidades**:
- **Informações do Projeto**: Nome, versão, descrição
- **Equipe**: Lista de desenvolvedores e colaboradores
- **Tecnologias**: Stack tecnológico utilizado
- **Licença**: Informações de licenciamento
- **Links**: Repositório, documentação, suporte

---

## 🛠️ Componentes e Utilitários

### Button.js (Componente de Botão)

**Localização**: `src/ui/Button.js`

**Características**:
- Componente reutilizável para botões do jogo
- Suporte a hover effects personalizados
- Animações de escala e cor
- Callbacks customizáveis
- Estilização via parâmetros

**API**:
```javascript
new Button(scene, x, y, text, callback, options)
```

**Opções**:
- `backgroundColor`: Cor de fundo (hex)
- `hoverColor`: Cor no hover (hex)
- `width`: Largura do botão
- `height`: Altura do botão
- `fontSize`: Tamanho da fonte
- `fontFamily`: Família da fonte

### GameData.js (Gerenciamento de Dados)

**Localização**: `src/utils/GameData.js`

**Funcionalidades**:
- **Carregamento de Perguntas**: Fetch de `data/perguntas.json`
- **Gerenciamento de Estado**: Pontuação, pergunta atual, progresso
- **Persistência**: LocalStorage para configurações e nome do jogador
- **Utilitários**: Shuffle de arrays, seleção aleatória

**Métodos Principais**:
- `loadPerguntas()`: Carrega perguntas do JSON
- `resetJogo()`: Reinicia o estado do jogo
- `saveConfig()`: Salva configurações
- `loadConfig()`: Carrega configurações
- `saveNomeJogador()`: Salva nome do jogador
- `loadNomeJogador()`: Carrega nome do jogador

### ThreeRenderer.js (Renderer 3D Inicial)

**Localização**: `src/3d/ThreeRenderer.js`

**Funcionalidades**:
- Renderização do átomo estilizado na tela inicial
- Gerenciamento de ciclo de vida (init, animate, cleanup)
- Controle de visibilidade
- Responsivo a redimensionamento

**Características Técnicas**:
- WebGLRenderer com alpha channel
- Shadow mapping habilitado
- Iluminação multi-fonte
- Animação contínua via requestAnimationFrame

---

## 📊 Estrutura de Dados

### perguntas.json

**Localização**: `data/perguntas.json`

**Estrutura**:
```json
{
  "perguntas": [
    {
      "id": 1,
      "enunciado": "Qual é a fórmula química da água?",
      "alternativas": [
        "H₂O",
        "CO₂",
        "NaCl",
        "CH₄"
      ],
      "resposta": 0,
      "explicacao": "A água é composta por dois átomos de hidrogênio e um de oxigênio.",
      "nivel": "facil",
      "tag": "quimica-basica"
    }
  ]
}
```

**Campos**:
- `id`: Identificador único
- `enunciado`: Texto da pergunta
- `alternativas`: Array com 4 opções
- `resposta`: Índice da resposta correta (0-3)
- `explicacao`: Explicação detalhada
- `nivel`: Dificuldade (facil, medio, dificil)
- `tag`: Categoria/tag para filtragem

**Quantidade**: 50 perguntas cobrindo diversos tópicos de química

---

## 🎨 Design e Estética

### Paleta de Cores

```css
--primary-blue: #1E3A8A
--cobalt-blue: #2563EB
--cyan: #06B6D4
--violet: #8B5CF6
--white: #FFFFFF
--gray-light: #F3F4F6
--gray-medium: #9CA3AF
--gray-dark: #4B5563
--success: #10B981
--error: #EF4444
--warning: #F59E0B
```

### Tipografia

- **Fonte Principal**: Inter (Google Fonts)
- **Pesos Utilizados**: 400 (regular), 600 (semi-bold), 700 (bold), 800 (extra-bold)
- **Características**: Sans-serif moderna, legível, refinada

### Direção de Arte

- **Tema**: Ciência e tecnologia educacional
- **Estilo**: Clean, futurista, minimalista
- **Iluminação**: Suave, ambiente científico
- **Efeitos**: Partículas sutis, animações fluidas
- **Polish**: Micro-interações, transições suaves

---

## ⚙️ Configuração Técnica

### Phaser 3 Configuration

**Localização**: `src/main.js`

```javascript
{
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#0F172A',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: SceneInicial,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  audio: {
    disableWebAudio: true
  }
}
```

**Características**:
- Modo AUTO (WebGL com fallback para Canvas)
- Responsivo com RESIZE mode
- Centralização automática
- Web Audio desabilitado (evita problemas de autoplay)

### Three.js Setup

**Cena Inicial**:
- PerspectiveCamera (50° FOV)
- WebGLRenderer com antialiasing
- Background transparente
- Shadow mapping habilitado

**Laboratório 3D**:
- PerspectiveCamera (50° FOV)
- WebGLRenderer sem alpha
- Background sólido (#0F172A)
- Controles de mouse e wheel

---

## 🔄 Fluxo de Navegação

```
SceneInicial
    ├── JOGAR → SceneJogo → SceneResultado → (Voltar ou Jogar Novamente)
    ├── LABORATÓRIO 3D → Scene3D → (Voltar)
    ├── CONFIGURAÇÕES → SceneConfiguracoes → (Voltar)
    └── CRÉDITOS → SceneCreditos → (Voltar)
```

**Transições**:
- Fade-in/Fade-out entre cenas
- Animações suaves
- Preservação de estado quando apropriado

---

## 💾 Persistência de Dados

### LocalStorage Keys

- `quimicaConfig`: Configurações do jogo (volume, dificuldade, etc.)
- `quimicaNomeJogador`: Nome do jogador
- `quimicaHistorico`: Histórico de partidas (se implementado)

### Estrutura de Config

```javascript
{
  volume: 0.7,
  dificuldade: 'medio',
  efeitosSonoros: true,
  trilhaSonora: true
}
```

---

## 🚀 Scripts e Comandos

### package.json Scripts

```json
{
  "dev": "npx http-server . -p 8080 -c-1",
  "build": "echo 'Build estático - arquivos prontos para deploy'",
  "start": "npm run dev"
}
```

**Uso**:
- `npm run dev`: Inicia servidor de desenvolvimento na porta 8080
- `npm start`: Alias para `npm run dev`
- `npm run build`: Placeholder para build de produção

### Servidor de Desenvolvimento

- **Ferramenta**: http-server
- **Porta**: 8080
- **Cache**: Desabilitado (`-c-1`)
- **Acesso**: http://localhost:8080

---

## 📦 Dependências

### Produção

```json
{
  "phaser": "^3.70.0",
  "three": "^0.158.0"
}
```

### Desenvolvimento

```json
{
  "http-server": "^14.1.1"
}
```

### CDN (Import Map)

```html
{
  "phaser": "https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js",
  "three": "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js"
}
```

---

## 🎯 Funcionalidades Avançadas

### Sistema de Partículas

**Implementação**: Phaser Particles
- Partículas de fundo na tela inicial
- Efeito sutil e não intrusivo
- Performance otimizada

### Animações e Transições

- **Tweens**: Animações suaves de posição, escala, alpha
- **Easing**: Funções de easing para movimentos naturais
- **Timeline**: Sequências de animação coordenadas

### Responsividade

- **Viewport**: Adapta-se a diferentes tamanhos de tela
- **Scale Mode**: RESIZE para manter proporções
- **Media Queries**: CSS responsivo para mobile

---

## 🔧 Soluções Técnicas Implementadas

### Problema: Phaser ESM Import

**Solução**: Módulo centralizado `src/utils/phaser.js`
```javascript
import * as PhaserModule from 'phaser';
const Phaser = PhaserModule.default || PhaserModule;
export default Phaser;
```

### Problema: AudioContext Autoplay

**Solução**: Desabilitar Web Audio no Phaser
```javascript
audio: { disableWebAudio: true }
```

### Problema: Z-index e Overlay

**Solução**: 
- Container 3D com `position: fixed`
- Z-index hierárquico bem definido
- Pointer-events controlados

### Problema: Three.js Cleanup

**Solução**: 
- Verificação de tipo antes de dispose
- Remoção adequada de event listeners
- Cancelamento de animation frames

---

## 📈 Performance e Otimizações

### Otimizações Implementadas

1. **Lazy Loading**: Modelos 3D carregados sob demanda
2. **Object Pooling**: Reutilização de objetos quando possível
3. **Renderização Condicional**: Render apenas quando necessário
4. **Pixel Ratio Limitado**: `Math.min(window.devicePixelRatio, 2)`
5. **Antialiasing**: Habilitado apenas onde necessário

### Métricas de Performance

- **FPS Target**: 60 FPS
- **Tempo de Carregamento**: < 2s
- **Tamanho Total**: ~500KB (sem assets)
- **Compatibilidade**: Navegadores modernos (Chrome, Firefox, Edge, Safari)

---

## 🧪 Testes e Qualidade

### Compatibilidade

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Recursos Utilizados

- WebGL para renderização 3D
- Canvas 2D para Phaser
- LocalStorage para persistência
- ES Modules para organização
- CSS Variables para temas

---

## 📝 Boas Práticas Aplicadas

1. **Modularidade**: Código organizado em módulos ES6
2. **Separação de Responsabilidades**: Cenas, UI, Utils separados
3. **Nomenclatura Consistente**: Padrão camelCase para JavaScript
4. **Comentários**: Código documentado onde necessário
5. **Error Handling**: Try-catch em operações críticas
6. **Clean Code**: Código limpo e legível

---

## 🎓 Casos de Uso Educacionais

### Aplicações

1. **Ensino Fundamental/Médio**: Introdução à química
2. **Preparação para Vestibular**: Revisão de conceitos
3. **Aprendizado Autônomo**: Estudo individual
4. **Avaliação Formativa**: Teste de conhecimento
5. **Visualização Molecular**: Compreensão de estruturas 3D

### Benefícios Pedagógicos

- **Interatividade**: Engajamento através de gamificação
- **Visualização 3D**: Compreensão espacial de moléculas
- **Feedback Imediato**: Aprendizado através de erros
- **Progressão**: Sistema de dificuldade adaptativa
- **Persistência**: Acompanhamento de progresso

---

## 🔮 Possíveis Melhorias Futuras

### Funcionalidades

- [ ] Sistema de conquistas/badges
- [ ] Multiplayer competitivo
- [ ] Mais modelos moleculares (20+)
- [ ] Modo de construção molecular
- [ ] Export de resultados em PDF
- [ ] Integração com LMS (Moodle, Canvas)
- [ ] Modo offline (Service Worker)
- [ ] Suporte a múltiplos idiomas

### Técnicas

- [ ] WebAssembly para cálculos pesados
- [ ] Progressive Web App (PWA)
- [ ] WebXR para realidade virtual
- [ ] Machine Learning para adaptação
- [ ] Analytics e telemetria
- [ ] A/B testing de interfaces

---

## 📄 Licença e Créditos

### Licença
MIT License - Livre para uso educacional e comercial

### Créditos
- **Framework 2D**: Phaser 3 (Photon Storm)
- **Framework 3D**: Three.js (mrdoob)
- **Fonte**: Inter (Rasmus Andersson)
- **Desenvolvimento**: Equipe de Extensão

---

## 🐛 Troubleshooting Comum

### Problema: Modelos 3D não aparecem
**Solução**: Verificar console para erros de WebGL, garantir que o container tem dimensões válidas

### Problema: Áudio não funciona
**Solução**: Navegador pode bloquear autoplay, requer interação do usuário

### Problema: Performance baixa
**Solução**: Reduzir pixel ratio, desabilitar antialiasing, verificar hardware

### Problema: LocalStorage não persiste
**Solução**: Verificar se cookies estão habilitados, modo privado pode bloquear

---

## 📚 Recursos e Referências

### Documentação Oficial
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Three.js Docs](https://threejs.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tutoriais e Exemplos
- Phaser 3 Examples
- Three.js Examples
- WebGL Fundamentals

---

## ✨ Conclusão

**Química em Ação** representa uma implementação completa e profissional de um jogo educacional web, combinando as melhores práticas de desenvolvimento front-end, design de jogos e experiência do usuário. O projeto demonstra integração bem-sucedida entre frameworks 2D e 3D, criação de interfaces intuitivas e implementação de mecânicas de jogo educacionais eficazes.

O código é modular, bem documentado e preparado para expansão futura, servindo como base sólida para projetos educacionais mais complexos.

---

**Versão do Documento**: 1.0  
**Última Atualização**: 2024  
**Autor**: Equipe de Desenvolvimento  
**Status**: Produção


