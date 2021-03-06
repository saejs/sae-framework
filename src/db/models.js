'use strict';

module.exports = (app) => {
    return (pathModels = null) => {

        const db = require('./db');

        const fs = require('fs');
        const path = require('path');
        const defineModel = require('./model');

        if (!pathModels) {
            const { getSequelizeConfig } = require('./helpers');
            const config = getSequelizeConfig(false);
            pathModels = config['models-path'];
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

        fs.readdirSync(pathModels)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
            })

            .forEach(file => {
                const model = require(path.join(pathModels, file))(db.sequelize, db.DataTypes);

                // Atribuir app no objeto model
                model.prototype.$app = app;
                model.app = app;

                // Atribuir db no objeto model
                model.prototype.$db = db;
                model.db = db;

                models[model.name] = model;
            });


        // Execute "associate" method
        Object.keys(models).forEach(modelName => {
            if (models[modelName].associate) {
                models[modelName].associate(models);
            }
        });

        // Registrar DB na lista de models.
        Object.assign(models, { db });

        return models;
    }
};