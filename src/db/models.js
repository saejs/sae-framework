'use strict';

const { db } = require('./db');

const fs = require('fs');
const path = require('path');
const { getSequelizeConfig } = require('./helpers');
const config = getSequelizeConfig(false);
const pathModels = config['models-path'];
const models = {};

//----------------------------------------------------------------------------------------
// Add defineModel method into sequelize db to pre definition model.
//----------------------------------------------------------------------------------------
db.sequelize.defineModel = (model, tableName, attributes, options = {}) => {
    return defineModel(db.sequelize, model, tableName, attributes, options);
};

//----------------------------------------------------------------------------------------
// Carregar arquivos do models.
//----------------------------------------------------------------------------------------
fs.readdirSync(pathModels)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })

    .forEach(file => {
        const model = require(path.join(pathModels, file))(db.sequelize, db.DataTypes);
        models[model.name] = model;
    });


// Execute "associate" method
Object.keys(db).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = models;