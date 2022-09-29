const can = require('../can');

module.exports = {

    check: () => {
        return async (req, res, next, info) => {
            // Verificar se regra foi informada
            if (!info.regra) {
                return next();
            }
            var regra = info.regra;

            // Verificar se tem permissao sobre a regra.
            if (can.check(regra)) {
                return next();
            }

            // Gerar erro
            res.error('erro.auth.msg.usuario_sem_permissao', { regra });
        }    
    },

}