const ticketsRouter = require('express').Router();
const { pool } = require('../config/config');

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
  )
})

module.exports = ticketsRouter;