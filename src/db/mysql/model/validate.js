const _ = require('lodash');
const InstanceValidator = require('sequelize/lib/instance-validator');
const validator = require('sequelize/lib/utils/validator-extras').validator;

const myRules = ['obrigatorio','obrigatorio_se'];

module.exports = (Model) => {
    Model.prototype.validate = async function (options) {

        // Executar o herdar antes
        await this.herdar();

        var iv = new InstanceValidator(this, options);

        // Customizar validação
        iv._invokeBuiltinValidator = async function (value, test, validatorType, field) {
            // Cast value as string to pass new Validator.js string requirement
            const valueString = String(value);

            // check if Validator knows that kind of validation test
            if (typeof validator[validatorType] !== 'function') {
                throw new Error(`Invalid validator function: ${validatorType}`);
            }

            const validatorArgs = this._extractValidatorArgs(test, validatorType, field);

            // CUSTOM: add datavalues para as regras
            validatorArgs.push(this.modelInstance.dataValues);

            if (!await validator[validatorType](valueString, ...validatorArgs)) {
                throw Object.assign(new Error(test.msg || `Validation ${validatorType} on ${field} failed`), { validatorName: validatorType, validatorArgs });
            }
        };

        // Customizar...
        iv._singleAttrValidate = async function (value, field, allowNull) {
            // If value is null and allowNull is false, no validators should run (see #9143)
            if ((value === null || value === undefined) && !allowNull) {
                // The schema validator (_validateSchema) has already generated the validation error. Nothing to do here.
                return;
            }

            // Promisify each validator
            const validators = [];
            _.forIn(this.modelInstance.validators[field], (test, validatorType) => {

                if (validatorType === 'isUrl' || validatorType === 'isURL' || validatorType === 'isEmail') {
                    // Preserve backwards compat. Validator.js now expects the second param to isURL and isEmail to be an object
                    if (typeof test === 'object' && test !== null && test.msg) {
                        test = {
                            msg: test.msg
                        };
                    } else if (test === true) {
                        test = {};
                    }
                }

                // Custom validators should always run, except if value is null and allowNull is false (see #9143)
                if (typeof test === 'function') {
                    validators.push(this._invokeCustomValidator(test, validatorType, true, value, field));
                    return;
                }

                // If value is null, built-in validators should not run (only custom validators have to run) (see #9134).
                if ((value === null || value === undefined) && (myRules.indexOf(validatorType) == -1)) {
                    return;
                }

                const validatorPromise = this._invokeBuiltinValidator(value, test, validatorType, field);
                // errors are handled in settling, stub this
                validatorPromise.catch(() => { });
                validators.push(validatorPromise);
            });

            return Promise
                .all(validators.map(validator => validator.catch(rejection => {
                    const isBuiltIn = !!rejection.validatorName;
                    this._pushError(isBuiltIn, field, rejection, value, rejection.validatorName, rejection.validatorArgs);
                })));

        }


        return await iv.validate();
    }
}