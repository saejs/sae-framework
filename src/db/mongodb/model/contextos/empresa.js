const ApiError = require('../../../../api_error');

module.exports = (schemaModel, auth, opts, app) => {
    return  {
        /**
         * Setar atributo da empresa
         */
        async setAttr(model) {
            // Verificar se model é por empresa
            var by_company = (schemaModel.get('by_company') === true);
            if (!by_company) {
                return false;
            }

            // Verificar se atributo jah foi informado
            var company_attr = schemaModel.get('company_attr');
            if (model[company_attr]) {
                return false;
            }

            // Verificar se usuario esta logado
            var user = auth.user();
            if (!user) {
                throw new ApiError('erro.auth.sem.contexto');
            }

            // Atribuir o atributo do model
            await app.events.emit('event.context.company.model', company_attr, model);

            return true;
        },

        /**
         * Setar filtro do where do empresa
         */
        async setWhere(query) {
            // Verificar se model é por empresa
            var by_company = (schemaModel.get('by_company') === true);
            if (!by_company) {
                return false;
            }

            // Verificar uncontext_company
            var uncontext_company = (schemaModel.get('uncontext_company') === true);
            if (uncontext_company) {
                schemaModel.set('uncontext_company', false);
                return false;
            }

            var company_attr = schemaModel.get('company_attr');

            // Atribuir o atributo do model
            await app.events.emit('event.context.company.query', company_attr, query);

            return true;
        }

    };
};