const carbon = require('rhinojs/support/carbon');

/**
 * Date
 */
const __functionDateSet = (model, nome, value, format) => {
    if (!value) {
        return value;
    }

    if ((typeof value == 'string') && (value != '')) {
        value = carbon.createFromFormat(value, format);
    }

    model.setDataValue(nome, value);
};

/**
 * Number
 */
const __functionNumberGet = (model, nome) => {
    var value = model.getDataValue(nome);
    if (value != null) {
        return value;
    }

    return (typeof value == 'string') ? new Number(value) : value;
};

module.exports = {
    date: {
        set: __functionDateSet,
    },

    number: {
        get: __functionNumberGet,
    }
};