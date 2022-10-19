module.exports = (schemaModel, opts, app) => {
    /**
     * Add method attrs
     */
    require('./attrs')(schemaModel, opts);

    /**
     * Add method hooks
     */
     require('./hooks')(schemaModel, opts);

    /**
     * Add controles de contexto no model
     */
    require('./context')(schemaModel, opts, app);

    /**
     * Extender method model "toJson"
     */
    require('./to_json')(schemaModel, opts);

    /**
     * Extender method model "query"
     */
    require('./query')(schemaModel, opts);

    /**
     * Extender method model "herdar"
     */
     //require('./herdar')(Model);

    /**
     * Extender method model "touch"
     */
     //require('./touches')(Model);
    
    /**
     * Extender method model "validate"
     */
    //require('./validate')(Model);
};