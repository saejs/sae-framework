const validator = require('validator');
const ApiError = require('./api_error');

const _validarAttrRule = async (value, ruleName, ruleOpts, attrName, errors) => {
    const valueString = String(value);

    // Verificar se regra existe
    if (typeof validator[ruleName] !== 'function') {
        throw new ApiError('erro.validacao.regra.nao.encontrada', ruleName);
    }

    // Executar regra
    if (!validator[ruleName](valueString)) {
        errors.push({
            error_id : 'erro.validacao.regra.' + ruleName.toLowerCase(),
            attr     : attrName,
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
    static async validate(data, rules) {
        var errors = [];

        var keys = Object.keys(rules);
        for (var i = 0; i < keys.length; i++) {
            var attr      = keys[i];
            var rulesAttr = rules[key];

            await _validarAttrRules(data[attr], rulesAttr, attr, errors);
        }

        return errors;
    }
}

module.exports = Validator;
