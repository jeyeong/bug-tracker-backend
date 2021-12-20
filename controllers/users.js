const usersRouter = require('express').Router();
const { pool } = require('../config/config');

usersRouter.get('/', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

usersRouter.get('/:id', (req, res) => {
  pool.query(`SELECT * FROM users WHERE user_id = '${req.params.id}'`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows[0]);
  });
})

module.exports = usersRouter;
