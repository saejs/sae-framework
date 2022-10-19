module.exports = (app, opts = {}) => {
    const db = {};

    // Carregar models
    db.loadModels = require('./models')(app, db);

    return db;
};