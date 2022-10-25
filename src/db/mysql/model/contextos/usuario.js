const auth = require('../../../../auth');
const ApiError = require('../../../../api_error');

/**
 * Setar ou query de usuario
 * @param {*} Model 
 * @returns {object}
 */
module.exports = (Model) => {

    return {
        /**
         * Setar atributo do contexto
         */
        async setAttr(model) {
            // Verificar se model é por usuario
            if (!model.constructor.context.byUser) {
                return false;
            }

            // Verificar se atributo já foi informado
            var user_attr = model.constructor.context.user_attr;
            if (model[user_attr]) {
                return false;
            }

            // Verificar se usuário esta logado
            var user = auth.user();
            if (!user) {
                throw new ApiError('erro.auth.sem.contexto', { attrName: user_attr });
            }

            // Atribuir attributo do model pelo usuario logado do usuario.
            model[user_attr] = user.id;

            return true;
        },

        /**
         * Setar filtro do where do contexto
         */
        async setWhere(model, options) {
            // Verificar se é por usuario
            if (!model.context.byUser) {
                return false;
            }

            // Verificar se deve ignorar o contexto
            if (options.uncontext_user) {
                return false;
            }

            var user = auth.user();
            var user_attr = model.context.user_attr;

            // Verificar se usuario esta logado
            if (user) {
                options.where[user_attr] = user.id;
            } else {
                options.where[user_attr] = '???';
            }

            return true;
        }
    };
};