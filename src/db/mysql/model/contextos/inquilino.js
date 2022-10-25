const auth = require('../../../../auth');
const ApiError = require('../../../../api_error');

/**
 * Setar ou query de inquilino
 * @param {*} Model 
 * @returns {object}
 */
module.exports = (Model) => {

    return {
        /**
         * Setar atributo do contexto
         */
        async setAttr(model) {
            // Verificar se é por inquilino
            if (!model.constructor.context.byTenant) {
                return false;
            }

            // Verificar se atributo já foi informado
            var tenant_attr = model.constructor.context.tenant_attr;
            if (model[tenant_attr]) {
                return false;
            }

            // Verificar se usuário esta logado
            var user = auth.user();
            if (!user) {
                throw new ApiError('erro.auth.sem.contexto', { attrName: tenant_attr });
            }

            // Atribuir attributo do model pelo inquilino logado do usuario.
            model[tenant_attr] = user[tenant_attr];

            return true;
        },

        /**
         * Setar filtro do where do contexto
         */
        async setWhere(model, options) {
            // Verificar se é por inquilino
            if (!model.context.byTenant) {
                return false;
            }

            // Verificar se deve ignorar o contexto
            if (options.uncontext_tenant) {
                return false;
            }

            var user = auth.user();
            var tenant_attr = model.context.tenant_attr;

            // Verificar se usuario esta logado
            if (user) {
                options.where[tenant_attr] = user[tenant_attr];
            } else {
                options.where[tenant_attr] = '???';
            }

            return true;
        }
    };
};