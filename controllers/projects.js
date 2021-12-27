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

  pool.query(queryString, (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

projectRouter.post('/', (req, res) => {
  const { name, description } = req.body;

  pool.query(
    'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING project_id',
    [name, description],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  )
})

projectRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  pool.query(
    'SELECT * FROM projects WHERE project_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  )
})

projectRouter.put('/change-name/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  pool.query(
    'UPDATE projects SET name = $1 WHERE project_id = $2',
    [name, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Name of project with ID ${id} updated.`);
    }
  )
})

projectRouter.put('/change-desc/:id', (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  pool.query(
    'UPDATE projects SET description = $1 WHERE project_id = $2',
    [description, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Description of project with ID ${id} updated.`);
    }
  )
})

module.exports = projectRouter;