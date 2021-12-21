const usersRouter = require('express').Router();
const { response } = require('express');
const { pool } = require('../config/config');

usersRouter.get('/', (req, res) => {
  pool.query(
    'SELECT * FROM users ORDER BY user_id',
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

usersRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  );
})

usersRouter.put('/', (req, res) => {
  const { user_id, role } = req.body;

  if (role === 'Admin') {
    res.status(400).json({error: 'Cannot set admin'});
    return;
  }

  pool.query(
    'UPDATE users SET role = $1 WHERE user_id = $2',
    [role, user_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User modified with ID: ${user_id}`);
    }
  )
})

module.exports = usersRouter;