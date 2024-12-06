const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Importar o CORS
const app = express();
const port = 3002;

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'sensordb.cpum6aqq2r5m.eu-north-1.rds.amazonaws.com',
    user: 'Cassiano',
    password: 'cassiano3241',
    database: 'distances_db'
});

// Verificar se a conexão foi bem-sucedida
db.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o banco de dados:', err);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
  console.log('Conectado ao banco de dados!');
});

// Habilitar o CORS para todas as origens
app.use(cors());

// Rota para obter a última distância
app.get('/api/last-distance', (req, res) => {
  const query = 'SELECT * FROM distances ORDER BY created_at DESC LIMIT 1';
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao buscar dados', details: err });
    }

    // Verificar se retornou algum dado
    if (result.length === 0) {
      console.log('Nenhum dado encontrado');
      return res.status(404).json({ error: 'Nenhum dado encontrado' });
    }

    // Exibir o dado encontrado
    console.log('Dados encontrados:', result);
    res.json(result[0]); // Retorna o primeiro (último) registro
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
