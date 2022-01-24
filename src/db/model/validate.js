const InstanceValidator = require('sequelize/lib/instance-validator');
const validator = require('sequelize/lib/utils/validator-extras').validator;

module.exports = (Model) => {
    Model.prototype.validate = async function (options) {
        var iv = new InstanceValidator(this, options);

        // Customizar validação
        iv._invokeBuiltinValidator = async function(value, test, validatorType, field) {
            // Cast value as string to pass new Validator.js string requirement
            const valueString = String(value);
            // check if Validator knows that kind of validation test
            if (typeof validator[validatorType] !== 'function') {
              throw new Error(`Invalid validator function: ${validatorType}`);
            }
        
            const validatorArgs = this._extractValidatorArgs(test, validatorType, field);

            // CUSTOM: add datavalues
            validatorArgs.push(this.modelInstance.dataValues);
        
            if (!validator[validatorType](valueString, ...validatorArgs)) {
              throw Object.assign(new Error(test.msg || `Validation ${validatorType} on ${field} failed`), { validatorName: validatorType, validatorArgs });
            }
        };
       

        return iv.validate();
    }
}