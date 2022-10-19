const ApiError = require('../../../../api_error');

module.exports = (schemaModel, auth, opts) => {
    return  {
        /**
         * Setar atributo do inquilino
         */
        setAttr(model) {
            // Verificar se model é por inquilino
            var by_tenant = (schemaModel.get('by_tenant') === true);
            if (!by_tenant) {
                return false;
            }

            // Verificar se atributo jah foi informado
            var tenant_attr = schemaModel.get('tenant_attr');
            if (model[tenant_attr]) {
                return false;
            }

            // Verificar se usuario esta logado
            var user = auth.user();
            if (!user) {
                throw new ApiError('erro.auth.sem.contexto');
            }

            // Atribuir o atributo do model
            model[tenant_attr] = user[tenant_attr];

            return true;
        },

        /**
         * Setar filtro do where do inquilino
         */
        setWhere(query) {
            // Verificar se model é por inquilino
            var by_tenant = (schemaModel.get('by_tenant') === true);
            if (!by_tenant) {
                return false;
            }

            // Verificar uncontext_tenant
            var uncontext_tenant = (schemaModel.get('uncontext_tenant') === true);
            if (uncontext_tenant) {
                schemaModel.set('uncontext_tenant', false);
                return false;
            }

            var user = auth.user();
            var tenant_attr = schemaModel.get('tenant_attr');

            if (user) {
                query[tenant_attr] = user[tenant_attr];
            } else {
                query[tenant_attr] = '???';
            }

            return true;
        }

    };
};