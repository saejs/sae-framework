module.exports = (app, opts = {}) => {
    const db = require('./db');

    // Carregar models
    db.loadModels = require('./models')(app);

    return db;
};