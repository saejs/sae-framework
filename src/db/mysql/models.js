'use strict';

module.exports = (app) => {
    return (pathModels = null) => {

        const db = require('./db');

        const fs = require('fs');
        const path = require('path');
        const defineModel = require('./model');

        // Verificar se pathModels foi informado
        if (!pathModels) {
            const { getSequelizeConfig } = require('./helpers');
            const config = getSequelizeConfig(false);
            pathModels = config['models-path'];
        }

        // Verificar se pathModels é um array
        if ((typeof pathModels != 'object') || ((typeof pathModels == 'object') && (pathModels.constructor.name != 'Array'))) {
            pathModels = [pathModels];
        }

        //----------------------------------------------------------------------------------------
        // Add defineModel method into sequelize db to pre definition model.
        //----------------------------------------------------------------------------------------
        db.sequelize.defineModel = (model, tableName, attributes, options = {}) => {
            return defineModel(db.sequelize, model, tableName, attributes, options);
        };

        //----------------------------------------------------------------------------------------
        // Carregar arquivos do models.
        //----------------------------------------------------------------------------------------
        const models = {};

        for (let i = 0; i < pathModels.length; i++) {
            const pathModelItem = pathModels[i];
            
            fs.readdirSync(pathModelItem)
                .filter(file => {
                    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
                })
    
                .forEach(file => {
                    const model = require(path.join(pathModelItem, file))(db.sequelize, db.DataTypes);
    
                    // Atribuir app no objeto model
                    model.prototype.$app = app;
                    model.app = app;
    
                    // Atribuir db no objeto model
                    model.prototype.$db = db;
                    model.db = db;
    
                    models[model.name] = model;
                });
        }

        // Execute "associate" and "prepare" method
        Object.keys(models).forEach(modelName => {
            // Prepare
            if (models[modelName].prepare) {
                models[modelName].prepare(models, db);
            }

            // Associate
            if (models[modelName].associate) {
                models[modelName].associate(models);
            }
        });

        // Registrar DB na lista de models.
        Object.assign(models, { db });

        return models;
    }
};