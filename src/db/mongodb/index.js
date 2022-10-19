const mongoose = require('mongoose');

//var conn = null;

module.exports = async (app, opts = {}) => {

    // Fazer conexão
    await mongoose.connect(opts.uri);

    const db = {
        mongoose,
        //conn,
    };

    // Carregar models
    db.loadModels = require('./models')(app, db);

    // Agendar o disconect
    //app.on('route.end', async () => {
        //auth.clear();
    //});


    return db;
};