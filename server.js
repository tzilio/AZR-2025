require("dotenv").config();
console.log(process.env.DB_HOST);

const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

require("dotenv").config();
console.log('Host:', process.env.PG_HOST); // Deve exibir o valor definido no .env


// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para a página de produtos
const produtosRoutes = require('./src/application/app');
app.use(produtosRoutes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
