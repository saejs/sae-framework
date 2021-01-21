module.exports = (Model) => {
    const __findOne = Model.findOne;
    Model.__findOne = __findOne;
    Model.findOne = async function (options = {}) {
        // Aplicar os filtros de contexto
        this.setWhereContext(options);

        // Executar o findOne original
        return await this.__findOne(options);
    }
}