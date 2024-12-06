const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'sensordb.cpum6aqq2r5m.eu-north-1.rds.amazonaws.com',
    user: 'Cassiano',
    password: 'cassiano3241',
    database: 'distances_db'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

// Rota para obter a última distância
app.get('/api/last-distance', (req, res) => {
    const query = 'SELECT * FROM distances ORDER BY timestamp DESC LIMIT 1';
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar dados' });
        } else {
            res.json(result[0]); // Retorna o último registro
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
