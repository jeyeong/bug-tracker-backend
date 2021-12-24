const usersRouter = require('express').Router();
const { pool } = require('../config/config');

usersRouter.get('/', (req, res) => {
  pool.query(
    "SELECT * FROM users WHERE role <> '' ORDER BY user_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

usersRouter.get('/unassigned', (req, res) => {
  pool.query(
    "SELECT * FROM users WHERE role = '' ORDER BY user_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

usersRouter.put('/reset', async (req, res) => {
  const queryString = `
    UPDATE users AS u SET
      role = u_new.role
    FROM (values
      ('10000', 'Project Manager'),
      ('10001', 'Project Manager'),
      ('10002', 'Developer'),
      ('10003', 'Developer'),
      ('10004', 'Submitter'),
      ('10005', 'Submitter'),
      ('10100', ''),
      ('10101', ''),
      ('10102', '')
    ) AS u_new(user_id, role)
    WHERE u.user_id = u_new.user_id
  `

  pool.query(queryString, (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json('Reset to demo default.');
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
});

usersRouter.put('/', (req, res) => {
  const { user_id, role } = req.body;

  if (role === 'Admin') {
    res.status(400).json({error: 'Cannot set admin.'});
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
});

module.exports = usersRouter;