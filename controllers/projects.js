const projectsRouter = require('express').Router();
const { pool } = require('../config/config');

// Get all projects and their managers
projectsRouter.get('/', (req, res) => {
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

// Get projects belonging to a certain user
projectsRouter.get('/user/:id', (req, res) => {
  const id = req.params.id;

  const queryString = `
    SELECT * FROM
      projects
    WHERE
      project_id
    IN (
      SELECT project_id FROM
        user_projects
      WHERE user_id = $1
    )
  `

  pool.query(queryString, [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

// Create a new project
projectsRouter.post('/', (req, res) => {
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
projectsRouter.get('/:id', (req, res) => {
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

// Delete a project
projectsRouter.delete('/:id', (req, res) => {
  const id = req.params.id;

  if (id === '1' || id === '2') {
    res.status(400).json({errorMsg: 'Cannot delete demo projects.'});
    return;
  }

  pool.query(
    'DELETE FROM projects WHERE project_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Deleted project ${id}.`);
    }
  )
})

// Change the name of a project
projectsRouter.put('/change-name/:id', (req, res) => {
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
projectsRouter.put('/change-desc/:id', (req, res) => {
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
projectsRouter.get('/:id/team', (req, res) => {
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
projectsRouter.post('/:pid/team/:uid', (req, res) => {
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
projectsRouter.delete('/:pid/team/:uid', (req, res) => {
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

// Update the manager of a project
projectsRouter.put('/:pid/manager/:uid', (req, res) => {
  const project_id = req.params.pid;
  const user_id = req.params.uid;

  pool.query(
    'UPDATE projects SET manager_id = $1 WHERE project_id = $2',
    [user_id, project_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Manager of project ${project_id} changed to user ${user_id}.`);
    }
  )
})

// Reset project 1: Bug Tracker Application
projectsRouter.put('/reset/1', async (req, res) => {
  const name = 'Bug Tracker Application';
  const desc = 'A full-stack Bug Tracker build, created with ReactJS, Express, and PostgreSQL.';
  const manager_id = '117085400102997502759';
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
  
  pool.query(
    'UPDATE projects SET name = $1, description = $2, manager_id = $3 WHERE project_id = 1',
    [name, desc, manager_id]
  );
  await pool.query('DELETE FROM user_projects WHERE project_id = 1');
  pool.query(teamConstructor);

  res.status(200).send('Project 1 reset.');
})

// Reset project 2: Chemistry Experiments
projectsRouter.put('/reset/2', async (req, res) => {
  const name = 'Chemistry Experiments';
  const desc = 'Experiments aimed at producing substances of the highest purity. These chemicals will be sold across America.';
  const manager_id = '10000';
  const teamConstructor = `
    INSERT INTO
      user_projects
    VALUES
      ('10000', 2),
      ('10001', 2),
      ('10002', 2),
      ('10003', 2),
      ('10004', 2),
      ('10005', 2)
  `
  
  pool.query(
    'UPDATE projects SET name = $1, description = $2, manager_id = $3 WHERE project_id = 2',
    [name, desc, manager_id]
  );
  await pool.query('DELETE FROM user_projects WHERE project_id = 2');
  pool.query(teamConstructor);

  res.status(200).send('Project 2 reset.');
})

module.exports = projectsRouter;