const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const str = require('rhinojs/support/str');

/**
 * Register new model.
 * 
 * @param {Sequelize} seq Instancia do sequelize
 * @param {String} model Nome do model
 * @param {String} tableName Nome da tabela
 * @param {Object} attributes Estrugura de atributos (campos)
 * @param {Object} options Estrutura de opções do sequelize
 * @returns Model
 */
module.exports = (seq, model, tableName, attributes, options = {}) => {

    // Atributos
    var attrs = {
        id: {
            type: Sequelize.STRING(36),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return str.replaceAll('-', '', uuidv4());
            }
        },
    };

    Object.assign(attrs, attributes);

    // Options
    var opts = {
        tableName: tableName,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    };
    Object.assign(opts, options);

    var Model = seq.define(model, attrs, opts);

    // Extendes model
    require('./model/extend')(Model);

    return Model;
};
