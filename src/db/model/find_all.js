const utils = require('./utils');

module.exports = (Model) => {
    const __findAll = Model.findAll;
    Model.__findAll = __findAll;
    Model.findAll = async function (options = {}) {
        utils.applyWhereModelContext(options, Model);

        return await this.__findAll(options);
    }
}