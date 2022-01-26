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

    var val = data[condAttr];
    if (val == condVal) {
        return (!(validator.isEmpty(str) || (str == 'undefined')));
    }
    
    return true;
};

module.exports = validatorRules