const App = require('./app');

const app = new App();

// Load database
app.db = require('./db');

module.exports = app;