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

// API endpoints
const usersRouter = require('./controllers/users');
const projectRouter = require('./controllers/projects');

app.get('/', (req, res) => {
  res.status(200).send('Bug Tracker Backend API')
});
app.use('/users', usersRouter);
app.use('/projects', projectRouter);

// Listener
app.listen(port, () => console.log(`Listening. Port: ${port}`));