module.exports = (Model) => {
    /**
     * Adicionar o evento de controle do find.
     */
    Model.addHook('beforeFind', (options) => {
        Model.db.transaction.apply(options);
        Model.setWhereContext(Model, options);
    });

    /**
     * Adicionar o evento de controle do count.
     */
    Model.addHook('beforeCount', (options) => {
        Model.db.transaction.apply(options);
        Model.setWhereContext(Model, options);
    });
}