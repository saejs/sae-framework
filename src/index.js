const App = require('./app');
const auth = require('./auth');

const app = new App();

// Load database
app.db = require('./db')(app);

// Criar alias hash no app
app.hash = require('./hash');

// Zerar auth apos o termino do route
app.on('route.end', async () => {
    auth.setUser(null);
});

module.exports = app;