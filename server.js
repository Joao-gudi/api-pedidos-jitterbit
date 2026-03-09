// ============================================
// API DE PEDIDOS - Versão Super Simples
// Feito por: João Gabriel Gudilunas
// Para: Processo Seletivo Jitterbit
// ============================================

// Importando as bibliotecas
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

// Criando o app
const app = express();
app.use(express.json()); // Pra entender JSON

// ============================================
// CONECTAR COM O BANCO DE DADOS
// ============================================
const url = 'mongodb://localhost:27017'; // Onde o MongoDB tá rodando
const dbName = 'loja'; // Nome do banco de dados
let banco; // Vai guardar a conexão com o banco

// Função pra conectar
MongoClient.connect(url)
  .then(cliente => {
    console.log('✅ Conectado');
    banco = cliente.db(dbName);
  })
  .catch(erro => {
    console.log('❌ Problema na conexão:', erro.message);
  });

// ============================================
// FUNÇÃO PRA TRANSFORMAR OS DADOS
// ============================================
function transformarPedido(dadosDoBody) {
  // Pega o numeroPedido "v10089015vdb-01" e fica só "v10089015vdb"
  const orderId = dadosDoBody.numeroPedido.split('-')[0];
  
  // Mapeia os itens pro novo formato
  const itensTransformados = dadosDoBody.items.map(item => {
    return {
      productId: parseInt(item.idItem),      // vira número
      quantity: item.quantidadelItem,        // só muda o nome
      price: item.valorItem                   // só muda o nome
    };
  });

  // Monta o objeto novo
  return {
    orderId: orderId,
    value: dadosDoBody.valorTotal,
    creationDate: new Date(dadosDoBody.dataCriacao),
    items: itensTransformados
  };
}

// ============================================
// ENDPOINT 1: CRIAR PEDIDO (POST)
// ============================================
app.post('/order', async (req, res) => {
  try {
    // Pega o que veio no body da requisição
    const dadosRecebidos = req.body;
    
    console.log('Recebi um pedido:', dadosRecebidos);
    
    // Transforma os dados
    const pedidoPraSalvar = transformarPedido(dadosRecebidos);
    
    // Pega a coleção do banco
    const colecao = banco.collection('pedidos');
    
    // Salva no banco
    const resultado = await colecao.insertOne(pedidoPraSalvar);
    
    // Manda resposta de sucesso
    res.status(201).json({
      mensagem: 'Pedido criado com sucesso!',
      pedido: pedidoPraSalvar
    });
    
  } catch (erro) {
    console.log('Erro:', erro);
    res.status(500).json({
      erro: 'Não foi possível criar o pedido'
    });
  }
});

// ============================================
// ENDPOINT 2: BUSCAR PEDIDO POR ID (GET)
// ============================================
app.get('/order/:orderId', async (req, res) => {
  try {
    // Pega o orderId da URL
    const orderId = req.params.orderId;
    
    console.log('Buscando pedido:', orderId);
    
    // Busca no banco
    const colecao = banco.collection('pedidos');
    const pedido = await colecao.findOne({ orderId: orderId });
    
    // Se não achou
    if (!pedido) {
      return res.status(404).json({
        erro: 'Pedido não encontrado :('
      });
    }
    
    // Se achou, manda de volta
    res.json(pedido);
    
  } catch (erro) {
    console.log('Erro:', erro);
    res.status(500).json({
      erro: 'Erro ao buscar pedido'
    });
  }
});

// ============================================
// ENDPOINT 3: LISTAR TODOS OS PEDIDOS (GET) - OPCIONAL
// ============================================
app.get('/order/list', async (req, res) => {
  try {
    const colecao = banco.collection('pedidos');
    
    // Busca todos os pedidos
    const todosPedidos = await colecao.find({}).toArray();
    
    res.json({
      quantidade: todosPedidos.length,
      pedidos: todosPedidos
    });
    
  } catch (erro) {
    console.log('Erro:', erro);
    res.status(500).json({
      erro: 'Erro ao listar pedidos'
    });
  }
});

// ============================================
// ENDPOINT 4: ATUALIZAR PEDIDO (PUT) - OPCIONAL
// ============================================
app.put('/order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const novosDados = req.body;
    
    const colecao = banco.collection('pedidos');
    
    // Atualiza o pedido
    const resultado = await colecao.updateOne(
      { orderId: orderId },
      { $set: novosDados }
    );
    
    // Verifica se atualizou
    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        erro: 'Pedido não encontrado'
      });
    }
    
    res.json({
      mensagem: 'Pedido atualizado com sucesso!'
    });
    
  } catch (erro) {
    console.log('Erro:', erro);
    res.status(500).json({
      erro: 'Erro ao atualizar pedido'
    });
  }
});

// ============================================
// ENDPOINT 5: DELETAR PEDIDO 
// ============================================
app.delete('/order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    const colecao = banco.collection('pedidos');
    
    // Deleta o pedido
    const resultado = await colecao.deleteOne({ orderId: orderId });
    
    // Verifica se deletou
    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        erro: 'Pedido não encontrado'
      });
    }
    
    res.json({
      mensagem: 'Pedido deletado com sucesso!'
    });
    
  } catch (erro) {
    console.log('Erro:', erro);
    res.status(500).json({
      erro: 'Erro ao deletar pedido'
    });
  }
});

// ============================================
// INICIAR O SERVIDOR
// ============================================
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`
  ====================================
  🚀 Servidor rodando!
  📍 URL: http://localhost:${PORTA}
  
  📌 Endpoints:
  POST   -> http://localhost:${PORTA}/order
  GET    -> http://localhost:${PORTA}/order/QUALQUER_ID
  GET    -> http://localhost:${PORTA}/order/list
  PUT    -> http://localhost:${PORTA}/order/QUALQUER_ID
  DELETE -> http://localhost:${PORTA}/order/QUALQUER_ID
  ====================================
  `);
});