require("dotenv").config({ path: '../../.env' });
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuração do banco de dados
const db = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }
});

// Teste de conexão
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Rota para exibir o catálogo com todos os itens
router.get('/catalogo', async (req, res) => {
  try {
    // Consulta para obter todos os itens da tabela "bearings"
    const result = await db.query('SELECT * FROM bearings ORDER BY codigo');
    const produtos = result.rows;
    
    // Renderiza a view 'catalogo' passando todos os produtos
    res.render('catalogo', { produtos });
  } catch (err) {
    console.error('Erro ao buscar produtos para o catálogo:', err);
    res.status(500).send('Erro ao carregar o catálogo de produtos.');
  }
});

module.exports = router;
