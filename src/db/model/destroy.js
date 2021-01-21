const utils = require('./utils');

module.exports = (Model) => {
    // Local
    const __destroy = Model.prototype.destroy;
    Model.prototype.__destroy = __destroy;
    Model.prototype.destroy = async function (options = {}) {
        utils.applyWhereModelContext(options, Model);

        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);

        return await this.__destroy(options);
    }

    // Static
    const __destroyStatic = Model.destroy;
    Model.__destroy = __destroyStatic;
    Model.destroy = async function (options = {}) {
        utils.applyWhereModelContext(options, Model);

        // Verificar se deve atribuir a transacao atual
        this.db.transaction.apply(options);

        return await this.__destroy(options);
    }
}