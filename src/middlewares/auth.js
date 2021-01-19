const auth = require('../auth');

const getAuthHeader = (req) => {
    var token = req.header('Authorization');
    if (!token) {
        return null;
    }

    return token;
};

const getAuthQuery = (req) => {
    var token = req.query('access_token');
    if (!token) {
        return null;
    }

    return token;
};

const getAuthRequest = (req) => {
    var token = getAuthHeader(req);
    if (!token) {
        return token;
    }

    var token = getAuthQuery(req);
    if (!token) {
        return token;
    }

    return null;
};


module.exports = {
    auth: () => {
        return async (req, res, next) => {
            // Verificar se já esta logado.
            if (auth.check()) {
                return next();
            }
    
            // Verificar se token foi informado
            var token = getAuthRequest(req);
            if (token) {
                if (await auth.load(token)) {
                    return next();
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
                res.error('erro.auth.usuario.logado');
            }
            
            // Verificar se token foi informado
            var token = getAuthRequest(req);
            if (token) {
                if (await auth.load(token)) {
                    res.error('erro.auth.usuario.logado');
                }
            }

            return next();
        }    
    }
}