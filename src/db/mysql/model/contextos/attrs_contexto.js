const auth = require('../../../../auth');
const ApiError = require('../../../../api_error');

/**
 * Setar ou query de attrs de contexto
 * @param {*} Model 
 * @returns {object}
 */
module.exports = (Model) => {

    /**
     * Assumir attributo usuario do contexto.
     */
    const __assumirContextoUsuario = (attrName, model) => {
        // Verificar se atributo já foi informado
        if (model[attrName]) {
            return false;
        }

        // Verificar se usuário esta logado
        var user = auth.user();
        if (!user) {
            throw new ApiError('erro.auth.sem.contexto', { attrName });
        }

        // Atribuir attributo do model pelo usuario logado do usuario.
        model[attrName] = user.id;

        return true;
    }

    /**
     * Assumir attributo empresa do contexto.
     */
    const __assumirContextoEmpresa = async (attrName, model) => {
        // Verificar se atributo já foi informado
        if (model[attrName]) {
            return false;
        }

        // Evento do contexto de empresa
        await Model.app.events.emit('event.context.company.model', attrName, model);

        return true;
    }


    return {
        /**
         * Setar atributo do contexto
         */
        async setAttr(model) {
            // Carregar atributos
            var attrs = model.constructor.rawAttributes;
            var ids = Object.keys(attrs);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var attr = attrs[id];

                if (!attr.context) {
                    continue;
                }

                // Verificar se deve assumir usuario logado
                if (attr.context.user) {
                    __assumirContextoUsuario(id, model);
                }

                // Verificar se deve empresa logado
                if (attr.context.company) {
                    await __assumirContextoEmpresa(id, model);
                }
            }
        },
    };
};