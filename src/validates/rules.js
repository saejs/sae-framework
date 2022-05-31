const validator = require('validator');
const _validar = require('./validar');

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
    await _validar(str, opts, errors, validatorRules, attrName + '.');
    
    return true;
};

validatorRules.obrigatorio_se = (str, opts, attrName, errors, data) => { 
    var condAttr = opts.attr;
    var condVal  = opts.val;

    // Converter para array se nescessario
    var condVals = (typeof condVal == 'object') ? condVal : [condVal];

    // Verificar se campo eh vazio
    if (!(validator.isEmpty(str) || (str == 'undefined') || (str == 'null'))) {
        return true;
    }

    // Verificar se algum valor do atributo corresponde para ser obrigatório
    var val = data[condAttr];
    for (var checkVal of condVals) {
        if (checkVal == val) {
            return false;
        }
    }

    return true;
};

module.exports = validatorRules