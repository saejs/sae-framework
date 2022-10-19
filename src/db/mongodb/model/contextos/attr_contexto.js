const ApiError = require('../../../../api_error');

module.exports = (schemaModel, auth, opts, app) => {

    /**
     * Assumri o contexto do usuario no attr.
     * 
     * @param {string} attrName 
     * @param {object} model 
     */
    const __assumirContextoUsuario = async (attrName, model) => {
        // Verificar se atributo jah foi informado
        if (model[attrName]) {
            return false;
        }

        // Verificar se usuario esta logado
        var user = auth.user();
        if (!user) {
            throw new ApiError('erro.auth.sem.contexto');
        }

        // Atribuir o atributo do model
        model[attrName] = user.id;

        return true;
    };

    /**
     * Assumri o contexto da empresa no attr.
     * 
     * @param {string} attrName 
     * @param {object} model 
     */
    const __assumirContextoEmpresa = async (attrName, model) => {
        // Verificar se atributo jah foi informado
        if (model[attrName]) {
            return false;
        }
   
        // Atribuir o atributo do model
        await app.events.emit('event.context.company.model', attrName, model);
    
        return true;
    };


    return {
        /**
         * Setar atributo do contexto dos atributos
         */
        async setAttr(model) {

            // Carregar atributos
            var attrs = model.schema.obj;
            var ids = Object.keys(attrs);

            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var attr = attrs[id];

                // Verificar se tem algum contexto definido
                if (!attr.context) {
                    continue;
                }

                // Verificar se deve assumir usuario logado
                if (attr.context.user) {
                    await __assumirContextoUsuario(id, model);
                }

                // Verificar se deve empresa logado
                if (attr.context.company) {
                    await __assumirContextoEmpresa(id, model);
                }
            }
        },
    };
};