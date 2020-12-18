const bc = require("bcryptjs");

module.exports = {
    /**
     * Comparar valor com hash criptografada.
     * @param {string} value Valor a ser comparado com o criptografado.
     * @param {string} hashed Hash criptografado original.
     * @returns {string}
     */
    check: (value, hashed) => {
        return bc.compareSync(value, hashed);
    },

    /**
     * Criptografar uma string.
     * @param {string} value Valor a ser criptografado.
     * @returns {string}
     */
    make: (value) => {
        var salt = bc.genSaltSync(12);

        return bc.hashSync(value, salt);
    }
};