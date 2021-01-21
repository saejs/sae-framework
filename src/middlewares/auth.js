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
    auth: () => {
        return async (req, res, next) => {
            // Verificar se já esta logado.
            if (auth.check()) {
                next();
                //auth.setUser(null); // movido para route.end
                return;
            }
    
            // Verificar se token foi informado
            var token = getAuthRequest(req);
            if (token) {
                if (await auth.load(token)) {
                    next();
                    //auth.setUser(null); // movido para route.end
                    return;
                }
            }

            // Gerar erro
            res.error('erro.auth.usuario.nao.logado');
        }    
    },

    guest: () => {
        return async (req, res, next) => {
            // Verificar ainda se já esta logado.
            if (auth.check()) {
                //auth.setUser(null); // movido para route.end
                res.error('erro.auth.usuario.logado');
                return;
            }
            
            // Verificar se token foi informado
            var token = getAuthRequest(req);
            if (token) {
                if (await auth.load(token)) {
                    //auth.setUser(null); // movido para route.end
                    res.error('erro.auth.usuario.logado');
                    return;
                }
            }

            return next();
        }    
    }
}