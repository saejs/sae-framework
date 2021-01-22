const validator = require('validator');
const ApiError = require('./api_error');

/**
 * Regras
 */
const validatorRules = {};

validatorRules.obrigatorio    = (str) => { return !validator.isEmpty(str); };
validatorRules.email          = (str) => { return validator.isEmail(str); };
validatorRules.cartaocredito  = (str) => { return validator.isCreditCard(str); };
validatorRules.hexadecimal    = (str) => { return validator.isHexadecimal(str); };
validatorRules.corhexa        = (str) => { return validator.isHexColor(str); };
validatorRules.opcoes         = (str, values) => { return validator.isIn(str, values); };
validatorRules.ip             = (str, version = 4) => { return validator.isIP(str, version); };
validatorRules.json           = (str, opts) => { return validator.isJSON(str, opts); };
validatorRules.url            = (str, opts) => { return validator.isURL(str, opts); };

const _validarAttrRule = async (value, ruleName, ruleOpts, attrName, errors) => {
    const valueString = String(value);

    // Verificar se regra existe
    if (typeof validatorRules[ruleName] !== 'function') {
        throw new ApiError('erro.validacao.regra.nao.encontrada', ruleName);
    }

    // Executar regra
    if (!validatorRules[ruleName](valueString)) {
        errors.push({
            error_id : 'erro.validacao.regra.' + ruleName.toLowerCase(),
            attr     : attrName,
            rule     : ruleName,
            value    : valueString,
        });
    }
};

const _validarAttrRules = async (value, rules, attrName, errors) => {
    var keyRules = Object.keys(rules);
    for (let i = 0; i < keyRules.length; i++) {
        const ruleName = keyRules[i];
        const ruleOpts = rules[ruleName];

        await _validarAttrRule(value, ruleName, ruleOpts, attrName, errors);
    }
};

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

        var keys = Object.keys(rules);
        for (var i = 0; i < keys.length; i++) {
            var attr      = keys[i];
            var rulesAttr = rules[attr];

            await _validarAttrRules(data[attr], rulesAttr, attr, errors);
        }

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