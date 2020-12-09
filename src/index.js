const db = require('./db');

module.exports = {
    App    : require('./app'),
    db     : db,
    models : db.models,
};