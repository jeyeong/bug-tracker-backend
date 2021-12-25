const projectRouter = require('express').Router();
const { pool } = require('../config/config');

projectRouter.get('/', (req, res) => {
  const queryString = `
    SELECT
      project_id, name, description, first_name, last_name
    FROM
      projects
    LEFT JOIN users ON
      projects.manager_id = users.user_id
    ORDER BY
      project_id
  `

  pool.query(
    queryString,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

module.exports = projectRouter;