const projectRouter = require('express').Router();
const { pool } = require('../config/config');

projectRouter.get('/', (req, res) => {
  pool.query(
    "SELECT * FROM projects ORDER BY project_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

module.exports = projectRouter;