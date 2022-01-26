const ApiError = require('../api_error');
const validatorRules = require('./rules');
const _validar = require('./validar');

class Validator
{
    /**
     * Executar validação do data pelo regra.
     * 
     * @param {Object} data Dados a ser validado
     * @param {Object} rules Regra para validar dados
     * @returns {Array}
     */   
    static async validar(data, rules) {
        var errors = [];
        data = (data) ? data : {};

        // Executar regra de validação
        await _validar(data, rules, errors, validatorRules);

        return errors;
    }

    /**
     * Executar validação do data pelo regra.
     * 
     * @param {Object} data Dados a ser validado
     * @param {Object} rules Regra para validar dados
     * @returns {boolean}
     */   
    static async falhas(data, rules) {
        var errors = await this.validar(data, rules);

        if (errors.length == 0) { 
            return true;
        }

        throw new ApiError('erro.validacao', errors);
    }
}

module.exports = Validator;