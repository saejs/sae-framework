module.exports = (Model) => {
    /**
     * Add method attrs
     */
    require('./attrs')(Model);

    /**
     * Add method scopes
     */
    require('./scope')(Model);

    /**
     * Add controles de contexto no model
     */
    require('./context')(Model);

    /**
     * Extender method model "findAll"
     */
    require('./find')(Model);

    /**
     * Extender method model "save"
     */
    require('./save')(Model);

    /**
     * Extender method model "destroy"
     */
    require('./destroy')(Model);

    /**
     * Extender method model "toJson"
     */
    require('./to_json')(Model);
};