const express = require('express');
const cors = require('cors');
const { pool } = require('./config');

// App config
const app = express();
const port = process.env.PORT || 8001;

// Middlewares
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? 'http://localhost:3000/' : '*',
}
app.use(cors(origin));

// DB config

// API endpoints
const getData = (req, res) => {
  pool.query('SELECT * FROM bugs', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
}

app.get('/', (req, res) => res.status(200).send('Hello'));

app
  .route('/data')
  .get(getData);

// Listener
app.listen(port, () => console.log(`Listening. Port: ${port}`));
