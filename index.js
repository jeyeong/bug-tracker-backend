const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// App config
const app = express();
const port = process.env.PORT || 8001;
const isProduction = process.env.NODE_ENV === 'production';

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors({ origin: isProduction ? '*' : '*' }));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})

// API endpoints
const usersRouter = require('./controllers/users');
const projectsRouter = require('./controllers/projects');
const ticketsRouter = require('./controllers/tickets');

app.get('/', (req, res) => {
  res.status(200).send('Bug Tracker Backend API')
});
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tickets', ticketsRouter);

// Listener
app.listen(port, () => console.log(`Listening. Port: ${port}`));