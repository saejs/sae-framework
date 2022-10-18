module.exports = (Model) => {
    // Local
    const __destroy = Model.prototype.destroy;
    Model.prototype.__destroy = __destroy;
    Model.prototype.destroy = async function (options = {}) {
        // Aplicar os filtros de contexto
        this.constructor.setWhereContext(this.constructor, options);

        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);

        // Executar o destroy original
        return await this.__destroy(options);
    }

    // Static
    const __destroyStatic = Model.destroy;
    Model.__destroy = __destroyStatic;
    Model.destroy = async function (options = {}) {
        // Aplicar os filtros de contexto
        this.setWhereContext(this, options);

        // Verificar se deve atribuir a transacao atual
        this.db.transaction.apply(options);

        // Executar o destroy original
        return await this.__destroy(options);
    }
}