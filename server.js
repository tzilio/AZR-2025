require("dotenv").config();
console.log(process.env.DB_HOST);

const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para catalogo que redireciona para produtos
app.get('/catalogo', (req, res) => {
    res.redirect('/produtos');
});

// Rota para a página de produtos (as rotas definidas no arquivo './src/application/app')
const produtosRoutes = require('./src/application/app');
app.use(produtosRoutes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
