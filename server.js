const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Inicializa o Express
const app = express();
app.use(express.json()); // Para interpretar o corpo das requisições em JSON
app.use(cors());         // Para permitir requisições de diferentes origens

// Conexão com o banco de dados MySQL usando variáveis de ambiente
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Host do banco de dados
    user: process.env.DB_USER,       // Usuário do banco de dados
    password: process.env.DB_PASS,   // Senha do banco de dados
    database: process.env.DB_NAME    // Nome do banco de dados
});

// Teste de conexão com o banco
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Encerra a aplicação se a conexão falhar
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para obter todas as estações
app.get('/estacoes', (req, res) => {
    db.query('SELECT * FROM estacoes', (err, results) => {
        if (err) {
            console.error('Erro ao buscar as estações:', err);
            res.status(500).json({ message: 'Erro ao buscar as estações' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Rota para obter uma estação específica pelo ID
app.get('/estacoes/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM estacoes WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar a estação:', err);
            res.status(500).json({ message: 'Erro ao buscar a estação' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Estação não encontrada' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Rota para obter as leituras de uma estação específica
app.get('/leituras/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM leituras WHERE estacao_id = ? ORDER BY data DESC', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar as leituras:', err);
            res.status(500).json({ message: 'Erro ao buscar as leituras' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Iniciar o servidor na porta configurada por variável de ambiente ou padrão 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
