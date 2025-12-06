# 🧪 Química em Ação

Jogo educacional de química desenvolvido com Phaser 3 e Three.js, oferecendo uma experiência interativa e visualmente atraente para o aprendizado de conceitos químicos.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PlacidoFjr/QUIMICAEMACAO)

**🌐 Demo**: [Em breve no Vercel](https://quimica-em-acao.vercel.app)

## 🎮 Sobre o Jogo

**Química em Ação** é um jogo educacional web que combina elementos 2D e 3D para criar uma experiência de aprendizado envolvente. O jogo apresenta:

- **Quiz Interativo**: Sistema de perguntas e respostas com feedback imediato
- **Interface Moderna**: Design futurista com animações suaves e feedback visual
- **Título 3D**: Texto 3D animado "QUÍMICA EM AÇÃO" na tela inicial

## 🚀 Tecnologias

- **Phaser 3**: Engine de jogos 2D para a lógica do jogo
- **Three.js**: Biblioteca 3D para modelos moleculares e elementos visuais
- **HTML5/CSS3**: Estrutura e estilização moderna
- **ES Modules**: Arquitetura modular e organizada

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior) - opcional, apenas para servidor de desenvolvimento
- Navegador moderno com suporte a ES Modules (Chrome, Firefox, Edge, Safari)

## 🛠️ Instalação

### Opção 1: Servidor Local (Recomendado)

1. Clone ou baixe o repositório
2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse o jogo em: `http://localhost:8080`

### Opção 2: Servidor HTTP Simples

Se você não tiver Node.js instalado, pode usar qualquer servidor HTTP simples:

- **Python 3**: `python -m http.server 8080`
- **PHP**: `php -S localhost:8080`
- Ou simplesmente abra o `index.html` diretamente no navegador (pode ter limitações com módulos ES)

## 📁 Estrutura do Projeto

```
quimica-em-acao/
├── src/
│   ├── scenes/          # Cenas do Phaser
│   │   ├── SceneInicial.js
│   │   ├── SceneJogo.js
│   │   ├── SceneResultado.js
│   │   ├── SceneConfiguracoes.js
│   │   └── SceneCreditos.js
│   ├── ui/              # Componentes de interface
│   │   └── Button.js
│   ├── utils/           # Utilitários
│   │   └── GameData.js
│   ├── 3d/              # Renderer 3D
│   │   └── ThreeRenderer.js
│   └── main.js          # Ponto de entrada
├── data/
│   └── perguntas.json   # Banco de perguntas
├── assets/              # Assets do jogo (sprites, modelos, etc.)
├── index.html           # HTML principal
├── styles.css           # Estilos globais
├── package.json         # Configuração do projeto
└── README.md           # Este arquivo
```

## 🎯 Funcionalidades

### Tela Inicial
- Título 3D animado "QUÍMICA EM AÇÃO"
- Menu de navegação com animações suaves
- Efeitos de partículas no background
- Transições elegantes entre cenas

### Quiz de Química
- Sistema de perguntas e respostas
- Feedback visual imediato (correto/incorreto)
- Explicações detalhadas para cada resposta
- Barra de progresso e pontuação em tempo real
- Perguntas embaralhadas aleatoriamente

### Configurações
- Toggle de som e música
- Seleção de dificuldade
- Persistência via LocalStorage

### Tela de Resultados
- Exibição de pontuação e porcentagem
- Mensagens personalizadas baseadas no desempenho
- Opção de jogar novamente

## 📊 Dados e Perguntas

As perguntas estão armazenadas em `data/perguntas.json` no seguinte formato:

```json
{
  "id": 1,
  "enunciado": "Pergunta aqui?",
  "alternativas": ["A", "B", "C", "D"],
  "resposta": 0,
  "explicacao": "Explicação detalhada",
  "nivel": "basico",
  "tag": "categoria"
}
```

### Adicionar Novas Perguntas

1. Abra `data/perguntas.json`
2. Adicione um novo objeto ao array `perguntas`
3. Certifique-se de que o campo `resposta` corresponde ao índice da alternativa correta (0-3)

## 🎨 Personalização

### Cores e Estilo

As cores principais estão definidas em `styles.css` através de variáveis CSS:

```css
:root {
    --primary-blue: #1E3A8A;
    --cobalt-blue: #2563EB;
    --cyan: #06B6D4;
    --violet: #8B5CF6;
    /* ... */
}
```

### Configuração do Jogo

Ajustes gerais podem ser feitos em `src/main.js`:

- Dimensões da tela
- Configurações do Phaser
- Ordem das cenas

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular:

- **Cenas**: Cada tela do jogo é uma cena Phaser independente
- **Componentes**: Elementos reutilizáveis (botões, etc.)
- **Utilitários**: Lógica de negócio (GameData, etc.)
- **3D**: Renderer Three.js separado para elementos 3D

### Fluxo de Dados

1. `GameData` gerencia perguntas, pontuação e configurações
2. Cenas carregam dados através de `GameData`
3. LocalStorage persiste configurações do usuário
4. Three.js renderiza elementos 3D independentemente do Phaser

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS ao carregar módulos ES:**
- Use um servidor HTTP local (não abra o arquivo diretamente)
- Execute `npm run dev` ou use outro servidor HTTP

**Elemento 3D não aparece:**
- Verifique se o navegador suporta WebGL
- Abra o console do navegador para verificar erros

**Perguntas não carregam:**
- Verifique se `data/perguntas.json` está no caminho correto
- Confirme que o servidor está servindo arquivos JSON corretamente

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento na porta 8080
- `npm start`: Alias para `npm run dev`
- `npm run build`: Prepara build estático (arquivos já estão prontos)

## 🚢 Deploy

### Deploy no Vercel (Recomendado)

O projeto está configurado para deploy no Vercel. Veja o arquivo `DEPLOY.md` para instruções detalhadas.

**Deploy rápido:**
1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com) e conecte seu repositório
3. O Vercel detectará automaticamente as configurações
4. Clique em "Deploy"

**Repositório:** [https://github.com/PlacidoFjr/QUIMICAEMACAO](https://github.com/PlacidoFjr/QUIMICAEMACAO)

### Outras Plataformas

- **Netlify**: Deploy direto via drag-and-drop
- **GitHub Pages**: Hospedagem gratuita para projetos estáticos
- **Servidor próprio**: Qualquer servidor web (Apache, Nginx, etc.)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Adicione novas perguntas em `data/perguntas.json`
2. Adicione novas funcionalidades seguindo a arquitetura existente
3. Reporte bugs ou sugestões

## 📄 Licença

Este projeto é parte de um Projeto de Extensão educacional.

## 🗺️ Roadmap

### Próximas Funcionalidades

- [ ] Sistema de conquistas
- [ ] Modo multiplayer/competição
- [ ] Mais perguntas e categorias
- [ ] Trilha sonora e efeitos sonoros
- [ ] Animações de transição aprimoradas
- [ ] Modo de estudo (sem pontuação)
- [ ] Exportação de resultados

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a seção de Troubleshooting
2. Consulte a documentação do Phaser 3: https://photonstorm.github.io/phaser3-docs/
3. Consulte a documentação do Three.js: https://threejs.org/docs/

## 🎓 Créditos

- **Phaser 3**: Engine de jogos 2D
- **Three.js**: Biblioteca 3D
- **Inter Font**: Google Fonts
- Desenvolvido como parte de um Projeto de Extensão

---

**Química em Ação** - Aprenda Química de Forma Interativa! 🧪✨

