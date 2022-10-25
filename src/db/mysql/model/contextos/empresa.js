const auth = require('../../../../auth');
const ApiError = require('../../../../api_error');

/**
 * Setar ou query de empresa
 * @param {*} Model 
 * @returns {object}
 */
module.exports = (Model) => {

    return {
        /**
         * Setar atributo do contexto
         */
        async setAttr(model) {
            // Verificar se model é por empresa
            if (!model.constructor.context.byCompany) {
                return false;
            }

            // Verificar se atributo já foi informado
            var company_attr = model.constructor.context.company_attr;
            if (model[company_attr]) {
                return false;
            }

            // Verificar se usuário esta logado
            var user = auth.user();
            if (!user) {
                throw new ApiError('erro.auth.sem.contexto', { attrName: company_attr });
            }

            // Atribuir attributo do model pelo usuario logado da empresa.
            await Model.app.events.emit('event.context.company.model', company_attr, model);

            return true;
        },

        /**
         * Setar filtro do where do contexto
         */
        async setWhere(model, options) {
            // Verificar se é por empresa
            if (!model.context.byCompany) {
                return false;
            }

            // Verificar se deve ignorar o contexto
            if (options.uncontext_company) {
                return false;
            }

            var company_attr = model.context.company_attr;

            // Atribuir query da empresa
            await Model.app.events.emit('event.context.company.query', company_attr, options.where);

            return true;
        }
    };
};