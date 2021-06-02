'use strict';

const Sequelize = require('sequelize');
const { getSequelizeConfig } = require('./helpers');
const registerDataTypesCustom = require('./datatypes');
const Transaction = require('./transaction');
const config = getSequelizeConfig(true);

if (!config) {
    throw "Config database not found";
}

//----------------------------------------------------------------------------------------
// Custom datatypes.
//----------------------------------------------------------------------------------------
registerDataTypesCustom(Sequelize);

//----------------------------------------------------------------------------------------
// Carregar sequelize.
//----------------------------------------------------------------------------------------
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//----------------------------------------------------------------------------------------
// Controle de transacoes
//----------------------------------------------------------------------------------------
const transaction = new Transaction(sequelize);

//----------------------------------------------------------------------------------------
// Query RAW
//----------------------------------------------------------------------------------------
const query = async (sql, opts = {}) => {
    // Tratar opções padrao
    opts = Object.assign({
        type: Sequelize.QueryTypes.SELECT,
    }, opts);

    // Aplicar transacoes
    transaction.apply(opts);

    // Executar Query
    return await sequelize.query(sql, opts);
}

const queryFirst = async (sql, opts = {}) => {
    opts = Object.assign({ plain: true }, opts);
    
    return await query(sql, opts);
}


module.exports = {
    db        : sequelize,
    DataTypes : Sequelize.DataTypes,
    sequelize,
    Sequelize,
    config,
    transaction,
    query,
    first: queryFirst,
};