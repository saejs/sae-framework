const rules = require('../validates/rules');

module.exports = (Sequelize) => {

    // Obrigatorio    
    Sequelize.Validator.extend('obrigatorio', function (value, opts, data) {
        return rules.obrigatorio(value);
    });

    // Obrigatorio Se
    Sequelize.Validator.extend('obrigatorio_se', (value, opts, data) => {
        return rules.obrigatorio_se(value, opts, null, null, data);
    });

    // Cartaocredito
    Sequelize.Validator.extend('cartaocredito', (value, opts, data) => {
        return rules.cartaocredito(value);
    });

    // Opcoes
    Sequelize.Validator.extend('opcoes', (value, opts, data) => {
        return rules.opcoes(value, opts);
    });
};