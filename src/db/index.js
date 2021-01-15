module.exports = (app) => {
    const db = require('./db');

    // Carregar models
    db.loadModels = require('./models')(app);

    return db;
};