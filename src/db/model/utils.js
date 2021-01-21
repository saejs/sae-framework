const auth = require('../auth');

module.exports = {
    applyWhereModelContext: (options, Model) => {
        // Verificar se where esta implementado
        if (!options.where) {
            options.where = {};
        }

        // Verificar se é por inquilino
        if (Model.byTenant) {
            var user = auth.user();
            if (user) {
                options.where.inquilino_id = user.inquilino_id;
            } else {
                options.where.inquilino_id = '?????';
            }
        }

        // Verificar se é por usuário
        if (Model.byUser) {
            var user = auth.user();
            if (user) {
                options.where.usuario_id = user.id;
            } else {
                options.where.usuario_id = '???';
            }
        }
    }
};