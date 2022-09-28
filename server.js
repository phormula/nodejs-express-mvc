require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./src/config');
const { logger } = require('./src/middleware/logEvents');
const errorHandler = require('./src/middleware/errorHandler');
const knex = require('knex');
const knexConfig = require('./knexfile');
const { Model } = require('objection');
const routes = require('./src/routes');
const { authenticationMiddleware } = require('./src/middleware');

const app = express();
const PORT = process.env.PORT || 3500;

// Initialize knex.
const knexdb = knex(knexConfig[process.env.NODE_ENV]);
Model.knex(knexdb);

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use(authenticationMiddleware);
//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/auth', express.static(path.join(__dirname, '/public')));

routes(app);

app.all('/api/*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' });
});

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'src', 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
