'use strict';

const Sequelize = require('sequelize');
const { getSequelizeConfig } = require('./helpers');
const config = getSequelizeConfig(true);

if (!config) {
    throw "Config database not found";
}

//----------------------------------------------------------------------------------------
// Carregar sequelize.
//----------------------------------------------------------------------------------------
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Add defineModel para registrar novo modelo pre-configurado.
//sequelize.defineModel = (model, tableName, attributes, options = {}) => {
//    return defineModel(sequelize, model, tableName, attributes, options);
//};

module.exports = {
    db        : sequelize,
    DataTypes : Sequelize.DataTypes,
    sequelize,
    Sequelize,
    config,
};