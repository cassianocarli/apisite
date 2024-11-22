const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializa o Express
const app = express();
app.use(express.json()); // Para interpretar o corpo das requisições em JSON
app.use(cors());         // Para permitir requisições de diferentes origens
app.use(bodyParser.urlencoded({ extended: true }));  // Para permitir que o body parser entenda dados enviados no formato url-encoded

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'sensordb.cpum6aqq2r5m.eu-north-1.rds.amazonaws.com',
    user: 'Cassiano',
    password: 'cassiano3241',
    database: 'fluviometro_db'
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

// Rota para inserir leituras no banco de dados com latitude e longitude fixas
app.post('/leituras', (req, res) => {
    const { estacao_id, nivel, distancia_ultrassonico } = req.body;

    if (!estacao_id || !nivel || !distancia_ultrassonico) {
        return res.status(400).json({ message: 'Dados incompletos' });
    }

    // Latitude e Longitude fixas
    const latitude = -23.5505;
    const longitude = -46.6333;

    const query = `
        INSERT INTO leituras (estacao_id, nivel, latitude, longitude, distancia_ultrassonico)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [estacao_id, nivel, latitude, longitude, distancia_ultrassonico];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro ao salvar dados no banco' });
        }
        res.status(200).json({ message: 'Leitura salva com sucesso' });
    });
});

// Iniciar o servidor na porta 8000
app.listen(8000, () => {
    console.log('API rodando na porta 8000');
});
