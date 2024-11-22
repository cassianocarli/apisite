// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Inicializa o Express
const app = express();
app.use(express.json()); // Para interpretar o corpo das requisições em JSON
app.use(cors());         // Para permitir requisições de diferentes origens

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'sensordb.cpum6aqq2r5m.eu-north-1.rds.amazonaws.com',  // Endereço do seu banco de dados MySQL na AWS
    user: 'Cassiano',       // Seu usuário do MySQL
    password: 'cassiano3241',     // Sua senha do MySQL
    database: 'fluviometro_db' // Nome do banco de dados
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para obter todas as estações
app.get('/estacoes', (req, res) => {
    db.query('SELECT * FROM estacoes', (err, results) => {
        if (err) {
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
            res.status(500).json({ message: 'Erro ao buscar as leituras' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Iniciar o servidor na porta 3000
app.listen(8000, () => {
    console.log('API rodando na porta 8000');
});

// Rota para adicionar uma nova leitura
app.post('/leituras', (req, res) => {
    const { nivel, distancia_ultrassonico, latitude, longitude, estacao_id } = req.body;

    // Verificar se todos os dados necessários foram recebidos
    if (!nivel || !distancia_ultrassonico || !latitude || !longitude || !estacao_id) {
        return res.status(400).json({ message: 'Dados insuficientes. Certifique-se de enviar todos os campos obrigatórios.' });
    }

    // Query para inserir a nova leitura no banco de dados
    const query = 'INSERT INTO leituras (nivel, distancia_ultrassonico, latitude, longitude, estacao_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nivel, distancia_ultrassonico, latitude, longitude, estacao_id], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ message: 'Erro ao salvar a leitura no banco de dados.' });
        }
        console.log('Leitura salva com sucesso:', result);
        res.status(201).json({ message: 'Leitura salva com sucesso', id: result.insertId });
    });
});
