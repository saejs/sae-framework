/**
 * Registrar estrutura de DB no app.
 * 
 * @param {object} app 
 * @returns {object}
 */
module.exports = (app) => {

    /**
     * Variavel no app do DB.
     */
    app.db = null;

    /**
     * Carregar estrutra do DB.
     * @returns {object}
     */
    app.loadDB = function(opts = {}) {

        // Atribuir config padrao
        opts = Object.assign({}, { driver: 'mysql' }, opts);

        // Verificar se db jah foi carregado
        if (app.db) {
            return app.db;
        }

        // Carregar estrutura mysql
        app.db = require('./' + opts.driver)(app, opts);

        return app.db;
    };
};