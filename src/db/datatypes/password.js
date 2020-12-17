const { Sequelize, DataTypes, Utils } = require('Sequelize');

module.exports = () => {
    class PASSWORD extends DataTypes.ABSTRACT
    {
        /**
         * SQL para criação do tipo do campo.
         * @returns {String}
         */
        toSql() {
            return 'VARCHAR(50)';
        }

        /**
         * Validar valor.
         * @param {*} value Valor
         * @param {*} options Opções
         * @returns {*}
         */
        validate(value, options) {
            return (typeof value === 'string');
        }

        /**
         * ???
         * @param {*} value 
         * @returns {*}
         */
        _sanitize(value) {
            return value;
        }

        /**
         * Tratamento do valor antes de enviar para o banco de dados.
         * @param {*} value Valor do model
         * @returns {string}
         */
        _stringify(value) {
            return value;
        }

        /**
         * Tratamento do valor após carregar do banco de dados para colocar no model.
         * @param {*} value Valor do banco de dados
         * @returns {string}
         */
        static parse(value) {
            return value;
        }
    }

    PASSWORD.prototype.key = PASSWORD.key = 'PASSWORD';
    DataTypes.PASSWORD = Utils.classToInvokable(PASSWORD);

    // Para mysql
    const MyTypes = DataTypes.mysql;
    DataTypes.PASSWORD.types.mysql = ['my_password_type'];
    MyTypes.PASSWORD = function PASSWORD() {
        if (!(this instanceof MyTypes.PASSWORD)) {
            return new MyTypes.PASSWORD();
        }
        DataTypes.PASSWORD.apply(this, arguments);
    }
    const util = require('util');
    util.inherits(MyTypes.PASSWORD, DataTypes.PASSWORD);

    MyTypes.PASSWORD.parse      = DataTypes.PASSWORD.parse;
    MyTypes.PASSWORD.toSql      = DataTypes.PASSWORD.toSql;
    MyTypes.PASSWORD.validate   = DataTypes.PASSWORD.validate;
    MyTypes.PASSWORD._sanitize  = DataTypes.PASSWORD._sanitize;
    MyTypes.PASSWORD._stringify = DataTypes.PASSWORD._stringify;
};