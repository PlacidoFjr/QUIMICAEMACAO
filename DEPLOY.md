# Deploy no Vercel - Química em Ação

## 🚀 Deploy Rápido

### Opção 1: Via GitHub (Recomendado)

1. **Fazer commit e push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Preparar para deploy no Vercel"
   git push origin main
   ```

2. **Conectar ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "Add New Project"
   - Selecione o repositório `PlacidoFjr/QUIMICAEMACAO`
   - O Vercel detectará automaticamente as configurações
   - Clique em "Deploy"

3. **Configurações do Projeto:**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: (deixe vazio - não precisa de build)
   - **Output Directory**: `./` (raiz do projeto)
   - **Install Command**: (deixe vazio - não precisa instalar dependências)
   
   **Importante**: Como é um projeto estático usando CDN, não precisa de build ou instalação de dependências.

### Opção 2: Via Vercel CLI

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy em produção:**
   ```bash
   vercel --prod
   ```

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Vercel (pode criar com GitHub)
- Código commitado no repositório

## ⚙️ Configurações Importantes

### Arquivo `vercel.json`
O arquivo `vercel.json` já está configurado com:
- Headers CORS para permitir requisições
- Content-Type correto para arquivos JSON
- Rotas configuradas para servir arquivos estáticos

### Estrutura de Arquivos
O projeto está pronto para deploy estático:
- `index.html` - Ponto de entrada
- `src/` - Código fonte JavaScript
- `data/` - Arquivo JSON de perguntas
- `styles.css` - Estilos
- `favicon.svg` - Ícone

## 🔧 Troubleshooting

### Problema: Erro 404 ao carregar módulos ES
**Solução**: O Vercel já está configurado para servir arquivos estáticos corretamente.

### Problema: Erro ao carregar perguntas.json
**Solução**: Verifique se o arquivo está em `data/perguntas.json` e se o Content-Type está correto (já configurado no vercel.json).

### Problema: Assets não carregam
**Solução**: Certifique-se de que todos os arquivos estão commitados no repositório.

## 📝 Após o Deploy

1. O Vercel fornecerá uma URL como: `https://quimica-em-acao.vercel.app`
2. Você pode configurar um domínio personalizado nas configurações do projeto
3. Cada push para a branch principal fará um novo deploy automaticamente

## 🔄 Atualizações

Para atualizar o site:
1. Faça as alterações no código
2. Commit e push para o GitHub
3. O Vercel fará deploy automático

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git)
- [Repositório no GitHub](https://github.com/PlacidoFjr/QUIMICAEMACAO)

---

**Desenvolvido por:**
- JOÃO ALEXANDRE DA SILVA MARTINS
- LUCAS BRITO LOPES
- PLÁCIDO FRANCISCO DA SILVA JUNIOR

**2025**

