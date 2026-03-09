# 📦 API de Gerenciamento de Pedidos

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-latest-brightgreen.svg)](https://www.mongodb.com/)

## 📋 Sobre o Projeto
API RESTful para gerenciamento de pedidos, desenvolvida como parte do processo seletivo para vaga Júnior na Jitterbit.

## ✅ Critérios Atendidos

### Funcionalidades Obrigatórias
- [x] Criar novo pedido (POST /order)
- [x] Buscar pedido por ID (GET /order/:orderId)
- [x] Listar todos pedidos (GET /order/list)
- [x] Atualizar pedido (PUT /order/:orderId)
- [x] Deletar pedido (DELETE /order/:orderId)

### Requisitos de Qualidade
- [x] Código organizado em camadas
- [x] Comentários explicativos
- [x] Convenções de nomenclatura
- [x] Tratamento de erros robusto
- [x] Status HTTP apropriados
- [x] Repositório no GitHub com commits organizados

### Extras (Opcionais)
- [x] Autenticação JWT (comente/descomente para ativar)
- [x] Documentação com exemplos
- [x] Paginação na listagem
- [x] Validação de dados
- [x] Índices no banco de dados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- MongoDB 6+
- Git

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/minha-api.git

# Entre na pasta
cd minha-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o MongoDB
mongod

# Execute a API
npm start
