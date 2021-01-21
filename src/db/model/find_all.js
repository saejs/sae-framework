module.exports = (Model) => {
    const __findAll = Model.findAll;
    Model.__findAll = __findAll;
    Model.findAll = async function (options = {}) {
        // Aplicar os filtros de contexto
        this.setWhereContext(this, options);

        // Executar o findAll original
        return await this.__findAll(options);
    }
}