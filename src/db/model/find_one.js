const utils = require('./utils');

module.exports = (Model) => {
    const __findOne = Model.findOne;
    Model.__findOne = __findOne;
    Model.findOne = async function (options = {}) {
        utils.applyWhereModelContext(options, Model);

        return await this.__findOne(options);
    }
}