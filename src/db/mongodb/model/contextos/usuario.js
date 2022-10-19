const ApiError = require('../../../../api_error');

module.exports = (schemaModel, auth, opts) => {
    return  {
        /**
         * Setar atributo do usuario
         */
        setAttr(model) {
            // Verificar se model é por usuario
            var by_user = (schemaModel.get('by_user') === true);
            if (!by_user) {
                return false;
            }

            // Verificar se atributo jah foi informado
            var user_attr = schemaModel.get('user_attr');
            if (model[user_attr]) {
                return false;
            }

            // Verificar se usuario esta logado
            var user = auth.user();
            if (!user) {
                throw new ApiError('erro.auth.sem.contexto');
            }

            // Atribuir o atributo do model
            model[user_attr] = user.id;

            return true;
        },

        /**
         * Setar filtro do where do usuario
         */
        setWhere(query) {
            // Verificar se model é por usuario
            var by_user = (schemaModel.get('by_user') === true);
            if (!by_user) {
                return false;
            }

            // Verificar uncontext_user
            var uncontext_user = (schemaModel.get('uncontext_user') === true);
            if (uncontext_user) {
                schemaModel.set('uncontext_user', false);
                return false;
            }

            var user = auth.user();
            var user_attr = schemaModel.get('user_attr');

            if (user) {
                query[user_attr] = user.id;
            } else {
                query[user_attr] = '???';
            }

            return true;
        }

    };
};