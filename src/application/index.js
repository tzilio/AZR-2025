// Instale as dependências com: npm install sequelize pg pg-hstore
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

// Configure a conexão com o banco de dados.
// Substitua os valores abaixo pelos dados reais do seu banco.
const sequelize = new Sequelize(
  'azrolamentos_database',              // Nome do banco de dados
  'thiagozilio',                       // Usuário
  'jOXRI74Ja5ZPUJ0ag8z5hZDI97JxXHiK',    // Senha
  {
    host: 'dpg-cu0npvbtq21c73bvqm0g-a.oregon-postgres.render.com',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Para certificados autoassinados; ajuste conforme necessário
      }
    }
  }
);

// Definindo o modelo para a tabela 'bearings'
// Caso o nome da tabela no banco seja diferente, ajuste o valor de tableName.
const Produto = sequelize.define('Produto', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'bearings',  // Nome da tabela no banco de dados
  freezeTableName: true,  // Impede que o Sequelize pluralize o nome da tabela
  timestamps: false       // Desabilita as colunas createdAt e updatedAt
});

// Função principal para buscar os produtos e gravá-los em um arquivo
async function listarProdutos() {
  try {
    // Testa a conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');

    // Consulta todos os produtos retornando apenas os atributos 'descricao' e 'marca'
    const produtos = await Produto.findAll({
      attributes: ['descricao', 'marca']
    });

    // Cria uma string de saída com cada produto no formato "nome / marca", um por linha.
    let output = '';
    if (produtos.length > 0) {
      produtos.forEach(produto => {
        output += `${produto.descricao} / ${produto.marca}\n`;
      });
    } else {
      output = 'Nenhum produto encontrado.\n';
    }

    // Grava a saída no arquivo 'produtos.txt'
    fs.writeFile('produtos.txt', output, err => {
      if (err) {
        console.error('Erro ao escrever no arquivo:', err);
      } else {
        console.log("Arquivo 'produtos.txt' salvo com sucesso!");
      }
    });
  } catch (error) {
    console.error('Erro ao conectar ou consultar o banco de dados:', error);
  } finally {
    // Encerra a conexão com o banco de dados
    await sequelize.close();
  }
}

// Executa a função principal
listarProdutos();
