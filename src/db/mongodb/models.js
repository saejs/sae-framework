'use strict';

module.exports = (app, db) => {
    return (pathModels = null) => {

        const fs = require('fs');
        const path = require('path');
        const defineModel = require('./model');

        // Verificar se pathModels é um array
        if ((typeof pathModels != 'object') || ((typeof pathModels == 'object') && (pathModels.constructor.name != 'Array'))) {
            pathModels = [pathModels];
        }

        //----------------------------------------------------------------------------------------
        // Add defineModel method into db to pre definition model.
        //----------------------------------------------------------------------------------------
        db.defineModel = (model, tableName, attributes, options = {}, schemaOptions = {}) => {
            return defineModel(app, db, model, tableName, attributes, options, schemaOptions);
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
                    const model = require(path.join(pathModelItem, file))(db);
    
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
                models[modelName].prepare(models, db, app);
            }
        });

        // Registrar DB na lista de models.
        Object.assign(models, { db });

        return models;
    }
};