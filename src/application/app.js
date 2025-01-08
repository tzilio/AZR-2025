require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

// Configuração do banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Rota para listar produtos (com ou sem busca)
router.get('/products', (req, res) => {
    let searchQuery = req.query.q;
    let sql = 'SELECT * FROM produtos';
    let params = [];

    // Se houver uma busca, adicionar a cláusula WHERE
    if (searchQuery) {
        sql += ' WHERE descricao LIKE ? OR marca LIKE ? OR codigo LIKE ?';
        searchQuery = `%${searchQuery}%`;
        params = [searchQuery, searchQuery, searchQuery];
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro na consulta de produtos:', err);
            res.status(500).send('Erro ao buscar produtos.');
        } else {
            res.render('products', { produtos: results, q: searchQuery });
        }
    });
});


module.exports = router;
