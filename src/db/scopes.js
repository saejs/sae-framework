module.exports = (model) => {

    /**
     * Definir escopo padrao.
     * 
     * @param {Object} scope Objeto do escopo.
     */
    model.scopeDefault = (scope) => {
        var _scope = model.scope('defaultScope')._scope;

        var where = {};

        // Atual
        Object.assign(where, _scope.where);

        // Mesclar
        Object.assign(where, scope.where);

        model.addScope('defaultScope', {
            where
        });
    }

}