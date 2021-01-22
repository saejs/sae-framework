const auth = require('../auth');
const str = require('rhinojs/support/str');

const getAuthHeader = (req) => {
    var token = req.headers.authorization ? req.headers.authorization : null;
    if (token == null) {
        return null;
    }

    // Temporariamente, remover o prefixo "Bearer "
    token = str.replaceAll('Bearer ', '', token);

    return token;
};

const getAuthQuery = (req) => {
    return req.query['access_token'] ? req.query['access_token'] : null;
};

const getAuthRequest = (req) => {
    var token = getAuthHeader(req);
    if (token != null) {
        return token;
    }

    var token = getAuthQuery(req);
    if (token != null) {
        return token;
    }

    return null;
};


module.exports = {
    prepare: () => {
        return async (req, res, next) => {
            // Verificar se token foi informado no contexto
            var token = getAuthRequest(req);
            if (token) {
                // Tentar carregar token
                await auth.load(token);
            }

            next();
        }
    },

    auth: () => {
        return async (req, res, next) => {
            // Verificar se ESTA logado.
            if (auth.check()) {
                next();
                return;
            }

            // Gerar erro
            res.error('erro.auth.usuario.nao.logado');
        }    
    },

    guest: () => {
        return async (req, res, next) => {
            // Verificar se NÃO esta logado.
            if (!auth.check()) {
                next();
                return;
            }

            res.error('erro.auth.usuario.logado');
        }    
    }
}