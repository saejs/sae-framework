const App = require('./app');

const app = new App();

// Load database
app.db = require('./db')(app);

// Criar alias hash no app
app.hash = require('./hash');

module.exports = app;