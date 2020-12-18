module.exports = (Sequelize) => {
    const DataTypes = Sequelize.DataTypes;
    const BASE_STRING = DataTypes.STRING.prototype.constructor;

    const bc = require("bcryptjs");

    class PASSWORD extends BASE_STRING
    {
        /**
         * Construir uma string de 60 chars
         */
        constructor()
        {
            super(60);
        }

        /**
         * Tratamento do valor antes de enviar para o banco de dados.
         * @param {*} value Valor do model
         * @returns {string}
         */
        _stringify(value) {
            if (!process.env.PASS_KEY) {
                return value;
            }

            // Criptografar senha
            var salt = bc.genSaltSync(12);
            return bc.hashSync(value, salt);
        }
    }
    
    PASSWORD.prototype.key = PASSWORD.key = 'PASSWORD';
    DataTypes.PASSWORD = Sequelize.Utils.classToInvokable(PASSWORD);
    Sequelize.PASSWORD = DataTypes.PASSWORD;
};