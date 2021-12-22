const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// App config
const app = express();
const port = process.env.PORT || 8001;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());

const isProduction = process.env.NODE_ENV === 'production';
const origin = { origin: isProduction ? '*' : '*' };
app.use(cors(origin));

// API endpoints
const usersRouter = require('./controllers/users');
const unassignedRouter = require('./controllers/unassignedUsers');

app.get('/', (req, res) => {
  res.status(200).send('Bug Tracker Backend API')
});
app.use('/users', usersRouter);
app.use('/unassigned', unassignedRouter);

// Listener
app.listen(port, () => console.log(`Listening. Port: ${port}`));
