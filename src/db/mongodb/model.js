const mongoose = require('mongoose');

/**
 * Register new model.
 * 
 * @param {app} app Instancia do APP
 * @param {db} db Instancia do DB
 * @param {String} collectionName Nome da coleção (tabela)
 * @param {Object} attributes Estrutura de atributos da coleção
 * @param {Object} options Estrutura de opções do model
 * @param {Object} schemaOptions Estrutura de opções do mongose
 * @returns Model
 */
module.exports = (app, db, collectionName, attributes, options = {}, schemaOptions = {}) => {

    // Tratar opções padrões
    var opts = Object.assign({}, {
        versionKey: null,

        toJSON: {
            getters: true,
        },

        timestamps: {
            createdAt: 'created_at',
            updatedAt : 'updated_at'
        }
    }, schemaOptions);

    // Montar schema
    var schemaModel = new mongoose.Schema(attributes, opts);

    // Tratar extends
    require('./model/extend')(schemaModel, options, app);

    return mongoose.model(collectionName, schemaModel);
};
