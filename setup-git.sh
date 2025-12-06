#!/bin/bash

echo "========================================"
echo " Setup Git e Push para GitHub"
echo "========================================"
echo ""

echo "[1/6] Inicializando repositório Git..."
git init

echo ""
echo "[2/6] Adicionando remote do GitHub..."
git remote add origin https://github.com/PlacidoFjr/QUIMICAEMACAO.git 2>/dev/null || \
git remote set-url origin https://github.com/PlacidoFjr/QUIMICAEMACAO.git

echo ""
echo "[3/6] Adicionando arquivos ao staging..."
git add .

echo ""
echo "[4/6] Fazendo commit inicial..."
git commit -m "Initial commit: Química em Ação - Jogo educacional completo"

echo ""
echo "[5/6] Configurando branch main..."
git branch -M main

echo ""
echo "[6/6] Fazendo push para GitHub..."
echo ""
echo "ATENÇÃO: Você precisará fazer login no GitHub!"
read -p "Pressione Enter para continuar..."

git push -u origin main

echo ""
echo "========================================"
echo " Concluído!"
echo "========================================"
echo ""
echo "Próximo passo: Conectar ao Vercel"
echo "Acesse: https://vercel.com/new"
echo ""

