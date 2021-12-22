const unassignedRouter = require('express').Router();
const { pool } = require('../config/config');

unassignedRouter.get('/', (req, res) => {
  pool.query(
    'SELECT * FROM unassigned_users ORDER BY user_id',
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

module.exports = unassignedRouter;