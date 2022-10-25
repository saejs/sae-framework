module.exports = (Model) => {
    /**
     * Adicionar o evento de controle do find.
     */
    Model.addHook('beforeFind', async (options) => {
        Model.db.transaction.apply(options);
        await Model.setWhereContext(Model, options);
    });

    /**
     * Adicionar o evento de controle do count.
     */
    Model.addHook('beforeCount', async (options) => {
        Model.db.transaction.apply(options);
        await Model.setWhereContext(Model, options);
    });
}