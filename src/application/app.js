require("dotenv").config({path: '../../.env'});
const express = require('express');
const { Pool } = require('pg'); // Importa o cliente para PostgreSQL
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

// Testar conexão ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Rota para listar produtos (com ou sem busca)
router.get('/products', async (req, res) => {
    let searchQuery = req.query.q;
    let sql = 'SELECT * FROM bearings';
    let params = [];

    // Se houver uma busca, adicionar a cláusula WHERE
    if (searchQuery) {
        sql += ' WHERE descricao ILIKE $1 OR marca ILIKE $2 OR codigo ILIKE $3';
        searchQuery = `%${searchQuery}%`;
        params = [searchQuery, searchQuery, searchQuery];
    }

    try {
        const results = await db.query(sql, params); // Executa a consulta
        res.render('products', { produtos: results.rows, q: searchQuery }); // Renderiza com os resultados
    } catch (err) {
        console.error('Erro na consulta de produtos:', err);
        res.status(500).send('Erro ao buscar produtos.');
    }
});

module.exports = router;
