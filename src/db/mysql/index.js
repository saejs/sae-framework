module.exports = async (app, opts = {}) => {
    const db = require('./db');

    // Carregar models
    db.loadModels = require('./models')(app);

    return db;
};