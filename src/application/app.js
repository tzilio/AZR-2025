require("dotenv").config({ path: '../../.env' });
const express = require('express');
const { Pool } = require('pg'); // Cliente para PostgreSQL
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

// Rota para listar produtos com filtros (busca, marca, tipo) e paginação  
router.get('/produtos', async (req, res) => {
  // Parâmetros da query string  
  let searchQuery = req.query.q || '';       // Busca textual (valor padrão: string vazia)
  const marca = req.query.marca || 'todas';    // Filtro por marca (valor padrão: 'todas')
  const tipo = req.query.tipo || 'todos';      // Filtro por tipo (valor padrão: 'todos')
  const page = parseInt(req.query.page) || 1;   // Página atual (padrão: 1)
  const itemsPerPage = 10;                     // Itens por página
  const offset = (page - 1) * itemsPerPage;      // Offset para paginação

  try {
    // Consulta para obter as marcas distintas, ordenadas alfabeticamente  
    const brandsResult = await db.query('SELECT DISTINCT marca FROM bearings ORDER BY marca');
    const brands = brandsResult.rows.map(row => row.marca);

    // Consulta para obter os tipos distintos (primeira palavra da descricao), ordenados alfabeticamente  
    const typesResult = await db.query("SELECT DISTINCT split_part(descricao, ' ', 1) AS tipo FROM bearings ORDER BY tipo");
    const types = typesResult.rows.map(row => row.tipo);

    // Montagem dinâmica da query SQL para produtos  
    let sql = 'SELECT * FROM bearings';
    let countSql = 'SELECT COUNT(*) FROM bearings';
    let params = [];
    let conditions = [];

    // Se houver busca textual, adiciona condição (para descricao, marca ou codigo)  
    if (searchQuery) {
      conditions.push(`(descricao ILIKE $${params.length + 1} OR marca ILIKE $${params.length + 1} OR codigo ILIKE $${params.length + 1})`);
      params.push(`%${searchQuery}%`);
    }

    // Filtro por marca (se definido e diferente de "todas")  
    if (marca && marca !== 'todas') {
      conditions.push(`marca = $${params.length + 1}`);
      params.push(marca);
    }

    // Filtro por tipo (primeira palavra da descrição) se diferente de "todos"
    if (tipo && tipo !== 'todos') {
      conditions.push(`split_part(descricao, ' ', 1) = $${params.length + 1}`);
      params.push(tipo);
    }

    // Se houver condições, adiciona a cláusula WHERE  
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      sql += whereClause;
      countSql += whereClause;
    }

    // Ordenação, limite e offset na query principal  
    sql += ` ORDER BY codigo LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(itemsPerPage, offset);

    // Executa a query para obter a contagem total (para paginação)  
    const countResult = await db.query(countSql, params.slice(0, params.length - 2));
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Executa a query para obter os produtos paginados  
    const result = await db.query(sql, params);
    const produtos = result.rows;

    // Renderiza a view 'produtos' passando os dados obtidos e os filtros atuais  
    res.render('produtos', { 
      produtos, 
      q: searchQuery, 
      marca, 
      tipo,
      currentPage: page, 
      totalPages,
      brands,  // Array com as marcas disponíveis  
      types    // Array com os tipos disponíveis  
    });
  } catch (err) {
    console.error('Erro na consulta de produtos:', err);
    res.status(500).send('Erro ao buscar produtos.');
  }
});

module.exports = router;
