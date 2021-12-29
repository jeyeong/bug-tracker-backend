const projectRouter = require('express').Router();
const { pool } = require('../config/config');

// Get all projects and their managers
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

// Create a new project
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

// Get a specific project
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

// Change the name of a project
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

// Change the description of a project
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

// Get the team members of a project
projectRouter.get('/:id/team', (req, res) => {
  const id = req.params.id;

  const queryString = `
    SELECT * FROM
      users
    WHERE user_id IN (
      SELECT user_id FROM
        user_projects
      WHERE project_id = $1
    )
    ORDER BY user_id
  `

  pool.query(queryString, [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  )
})

// Add a user to the project
projectRouter.post('/:pid/team/:uid', (req, res) => {
  const project_id = req.params.pid;
  const user_id = req.params.uid;

  pool.query(
    'INSERT INTO user_projects VALUES ($1, $2)',
    [user_id, project_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Added user ${user_id} to project ${project_id}.`);
    }
  )
})

// Delete a user from the project
projectRouter.delete('/:pid/team/:uid', (req, res) => {
  const project_id = req.params.pid;
  const user_id = req.params.uid;

  if (project_id === '1' && user_id === '117085400102997502759') {
    res.status(400).json({errorMsg: 'Forbidden delete.'});
    return;
  }

  pool.query(
    'DELETE FROM user_projects WHERE user_id = $1 AND project_id = $2',
    [user_id, project_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Deleted user ${user_id} from project ${project_id}.`);
    }
  )
})

// Reset project 1: Bug Tracker Application
projectRouter.put('/reset/1', async (req, res) => {
  const name = 'Bug Tracker Application';
  const desc = 'A full-stack Bug Tracker build, created with ReactJS, Express, and PostgreSQL.';
  const teamConstructor = `
    INSERT INTO
      user_projects
    VALUES
      ('117085400102997502759', 1),
      ('2222', 1),
      ('3333', 1),
      ('4444', 1),
      ('5555', 1)
  `
  
  pool.query('UPDATE projects SET name = $1 WHERE project_id = 1', [name]);
  pool.query('UPDATE projects SET description = $1 WHERE project_id = 1', [desc]);
  await pool.query('DELETE FROM user_projects WHERE project_id = 1');
  pool.query(teamConstructor);

  res.status(200).send('Project 1 reset.');
})

module.exports = projectRouter;