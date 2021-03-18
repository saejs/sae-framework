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
validatorRules.len            = (str, opts) => { return validator.isLength(str, opts); };
validatorRules.subitens       = async (str, opts, attrName, errors) => { 
    await _validar(str, opts, errors, attrName + '.');
    
    return true;
};

validatorRules.obrigatorio_se = async (str, opts, attrName, errors, data) => { 
    var condAttr = opts.attr;
    var condVal  = opts.val;

    var val = data[condAttr];
    if (val == condVal) {
        return !validator.isEmpty(str);
    }
    
    return true;
};

const _validatorArgs = (ruleOpts, attrName, errors, data) => {
    return [ruleOpts, attrName, errors, data];
}

const _validarAttrRule = async (value, ruleName, ruleOpts, attrName, errors, data) => {
    const validarValue = (ruleName == 'subitens') ? value : (String((value == undefined) ? '' : value));

    // Verificar se regra existe
    if (typeof validatorRules[ruleName] !== 'function') {
        throw new ApiError('erro.validacao.regra.nao.encontrada', ruleName);
    }

    // Carregar argumento da regra
    const validatorArgs = _validatorArgs(ruleOpts, attrName, errors, data);

    // Executar regra
    if (!await validatorRules[ruleName](validarValue, ...validatorArgs)) {
        errors.push({
            error_id : 'erro.validacao.regra.' + ruleName.toLowerCase(),
            attr     : attrName,
            rule     : ruleName,
            value    : validarValue,
        });

        return false;
    }

    return true;
};

const _validarAttrRules = async (value, rules, attrName, errors, data) => {
    var keyRules = Object.keys(rules);
    for (let i = 0; i < keyRules.length; i++) {
        const ruleName = keyRules[i];
        const ruleOpts = rules[ruleName];

        var ret = await _validarAttrRule(value, ruleName, ruleOpts, attrName, errors, data);
        if (!ret) {
            break;
        }
    }
};

const _validar = async (data, rules, errors, prefix = '') => {
    var keys = Object.keys(rules);
    for (var i = 0; i < keys.length; i++) {
        var attr      = keys[i];
        var rulesAttr = rules[attr];

        await _validarAttrRules(data[attr], rulesAttr, prefix + attr, errors, data);
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

        // Executar regra de validação
        await _validar(data, rules, errors);

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