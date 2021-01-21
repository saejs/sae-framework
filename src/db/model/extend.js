module.exports = (Model) => {
    /**
     * Add method scopes
     */
    require('./scope')(Model);

    /**
     * Extender method model "findAll"
     */
    require('./find_all')(Model);

    /**
     * Extender method model "findOne"
     */
    require('./find_one')(Model);

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