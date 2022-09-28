const webRouter = require('./web');
const apiRouter = require('./api');

function routes(app) {
  app.use('/', webRouter);
  app.use('/api', apiRouter);
}

module.exports = routes;
