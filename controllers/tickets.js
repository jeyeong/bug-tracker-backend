const ticketsRouter = require('express').Router();
const { pool } = require('../config/config');

// Get tickets of a specific project
ticketsRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  pool.query(
    'SELECT * FROM tickets WHERE ticket_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
})

// Get tickets belonging to a certain user
ticketsRouter.get('/user/:id', (req, res) => {
  const id = req.params.id;

  const queryString = `
    SELECT * FROM
      tickets
    WHERE
      project_id
    IN (
      SELECT project_id FROM
        user_projects
      WHERE
        user_id = $1
    )
  `

  pool.query(queryString, [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
})

// Summarize tickets of projects assigned to a user
ticketsRouter.get('/summary/:userid', (req, res) => {
  const id = req.params.userid;

  const queryString = `
    SELECT
      count(priority), project_id, priority
    FROM
      tickets
    WHERE
      project_id
    IN (
      SELECT project_id FROM
        projects
      WHERE
        project_id
      IN (
        SELECT project_id FROM
          user_projects
        WHERE user_id = $1
      )
    )
    GROUP BY project_id, priority
  `

  pool.query(queryString, [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
})

// Create a new ticket
ticketsRouter.post('/', (req, res) => {
  const {
    project_id,
    title,
    description,
    priority,
    submitter_id,
  } = req.body;

  pool.query(
    `INSERT INTO tickets
      (project_id, title, description, priority, submitter_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ticket_id`,
    [project_id, title, description, priority, submitter_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  );
})

module.exports = ticketsRouter;
