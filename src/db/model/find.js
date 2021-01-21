module.exports = (Model) => {
    /**
     * Adicionar o evento de controle do find.
     */
    Model.addHook('beforeFind', (options) => {
        Model.setWhereContext(Model, options);
    });
}