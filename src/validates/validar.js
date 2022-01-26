const ApiError = require('../api_error');

const _validatorArgs = (ruleOpts, attrName, errors, data) => {
    return [ruleOpts, attrName, errors, data];
}

const _validarAttrRule = async (value, ruleName, ruleOpts, attrName, errors, data, validatorRules) => {
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

const _validarAttrRules = async (value, rules, attrName, errors, data, validatorRules) => {
    var keyRules = Object.keys(rules);
    for (let i = 0; i < keyRules.length; i++) {
        const ruleName = keyRules[i];
        const ruleOpts = rules[ruleName];

        var ret = await _validarAttrRule(value, ruleName, ruleOpts, attrName, errors, data, validatorRules);
        if (!ret) {
            break;
        }
    }
};

const _validar = async (data, rules, errors, validatorRules, prefix = '') => {
    var keys = Object.keys(rules);
    for (var i = 0; i < keys.length; i++) {
        var attr      = keys[i];
        var rulesAttr = rules[attr];

        await _validarAttrRules(data[attr], rulesAttr, prefix + attr, errors, data, validatorRules);
    }
};

module.exports = _validar;