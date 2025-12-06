# 🚀 Guia Completo: GitHub + Vercel

## 📦 Passo 1: Inicializar Git e Fazer Commit Inicial

### Se o repositório já existe no GitHub (vazio):

```bash
# 1. Inicializar git (se ainda não foi feito)
git init

# 2. Adicionar remote do GitHub
git remote add origin https://github.com/PlacidoFjr/QUIMICAEMACAO.git

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer commit inicial
git commit -m "Initial commit: Química em Ação - Jogo educacional completo"

# 5. Renomear branch para main (se necessário)
git branch -M main

# 6. Fazer push para o GitHub
git push -u origin main
```

### Se precisar criar o repositório do zero:

1. Acesse [github.com/new](https://github.com/new)
2. Nome: `QUIMICAEMACAO`
3. Descrição: `Jogo educacional de química com Phaser 3 e Three.js`
4. Público/Privado: escolha conforme preferir
5. **NÃO** marque "Add a README file" (já temos um)
6. Clique em "Create repository"
7. Depois execute os comandos acima

## 🔗 Passo 2: Conectar ao Vercel

### Opção A: Via Interface Web (Mais Fácil)

1. **Acesse [vercel.com](https://vercel.com)**
   - Faça login com sua conta GitHub

2. **Adicionar Novo Projeto:**
   - Clique em "Add New..." → "Project"
   - Ou acesse: [vercel.com/new](https://vercel.com/new)

3. **Importar Repositório:**
   - Clique em "Import Git Repository"
   - Selecione `PlacidoFjr/QUIMICAEMACAO`
   - Clique em "Import"

4. **Configurar Projeto:**
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (raiz)
   - **Build Command**: (deixe vazio)
   - **Output Directory**: `./` (raiz)
   - **Install Command**: (deixe vazio)

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o processo (1-2 minutos)

6. **Pronto!**
   - Você receberá uma URL como: `https://quimica-em-acao.vercel.app`
   - Cada push no GitHub fará deploy automático

### Opção B: Via Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy (na pasta do projeto)
cd K:\Projetos\game
vercel

# 4. Deploy em produção
vercel --prod
```

## 📋 Checklist Antes do Deploy

- [x] `vercel.json` criado
- [x] `index.html` existe
- [x] `src/` com todos os arquivos
- [x] `data/perguntas.json` existe
- [x] `styles.css` existe
- [x] `favicon.svg` existe
- [x] `.gitignore` configurado
- [x] README.md atualizado

## 🔍 Verificar Arquivos Importantes

Certifique-se de que estes arquivos estão no repositório:

```
✅ index.html
✅ styles.css
✅ favicon.svg
✅ vercel.json
✅ package.json
✅ src/main.js
✅ src/scenes/*.js
✅ src/utils/*.js
✅ src/ui/*.js
✅ src/3d/*.js
✅ data/perguntas.json
✅ README.md
✅ DEPLOY.md
```

## 🐛 Troubleshooting

### Erro: "Repository not found"
- Verifique se o repositório existe no GitHub
- Confirme que você tem permissão de acesso
- Verifique a URL do remote: `git remote -v`

### Erro: "Failed to deploy"
- Verifique se todos os arquivos foram commitados
- Confirme que `index.html` está na raiz
- Verifique os logs no Vercel Dashboard

### Erro ao carregar módulos ES
- O Vercel serve arquivos estáticos corretamente
- Verifique se os caminhos dos imports estão corretos
- Confirme que o `importmap` no `index.html` está correto

## 📝 Comandos Úteis

```bash
# Ver status do git
git status

# Ver arquivos que serão commitados
git add -n .

# Ver histórico de commits
git log --oneline

# Verificar remote configurado
git remote -v

# Atualizar após mudanças no GitHub
git pull origin main
```

## 🎯 Próximos Passos Após Deploy

1. **Testar o site** na URL fornecida pelo Vercel
2. **Configurar domínio personalizado** (opcional)
3. **Adicionar descrição** no repositório GitHub
4. **Adicionar tags** no GitHub (educação, química, jogo, etc.)
5. **Compartilhar** o link do jogo!

## 🔗 Links Úteis

- **Repositório**: [https://github.com/PlacidoFjr/QUIMICAEMACAO](https://github.com/PlacidoFjr/QUIMICAEMACAO)
- **Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Documentação Vercel**: [https://vercel.com/docs](https://vercel.com/docs)

---

**Boa sorte com o deploy! 🚀**

