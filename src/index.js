const App = require('./app');

const app = new App();

// Load database
app.on('booted', (app) => {
    app.db = require('./db');
});

module.exports = app;