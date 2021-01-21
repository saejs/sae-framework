module.exports = (Model) => {

    /**
     * Definir escopo padrao.
     * 
     * @param {Object} scope Objeto do escopo.
     */
    Model.scopeDefault = (scope) => {
        var _scope = model.scope('defaultScope')._scope;

        var where = {};

        // Atual
        Object.assign(where, _scope.where);

        // Mesclar
        Object.assign(where, scope.where);

        model.addScope('defaultScope', {
            where
        }, { override: { default: true } });
    }
}