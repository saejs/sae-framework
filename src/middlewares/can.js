const can = require('../can');
const arr = require('rhinojs/support/arr');

module.exports = {

    check: () => {
        return async (req, res, next, info) => {
            // Verificar se regra foi informada
            if (!arr.exists(info, 'regra')) {
                res.error('erro.auth.msg.regra_can_invalida');
            }
            var regra = info.regra;

            // Verificar se tem permissao sobre a regra.
            if (await can.check(regra)) {
                return next();
            }

            // Gerar erro
            res.error('erro.auth.msg.usuario_sem_permissao', { regra });
        }    
    },

}