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

module.exports = {
    db        : sequelize,
    DataTypes : Sequelize.DataTypes,
    sequelize,
    Sequelize,
    config,
    transaction: new Transaction(sequelize),
};