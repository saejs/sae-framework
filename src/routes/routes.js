const version = require('./version');
const Resource = require('./resource');
const Middlewares = require('./middlewares');
const Auth = require('../middlewares/auth');
const Can = require('../middlewares/can');

module.exports = (app) => {
    /**
     * Controle de middlewares.
     */
    app.$middlewares = new Middlewares();

    /**
     * Alias GET,OPTIONS
     */
    app.get = (part, callback, middlewares = []) => {
        var middlewares_registrados = app.$middlewares.getAll(middlewares);
        var methods = ['get','head'];

        for (var i = 0; i < methods.length; i++) {
            var method = methods[i];
            app.$route[method](part, middlewares_registrados, async (req, res) => {
                try {
                    await callback(req, res);
    
                    await app.events.emit('route.end', req, res);
                } catch (err) {
                    res.error(err);
                }
            });
        }
    }

    /**
     * Alias POST
     */
    app.post = (part, callback, middlewares = []) => {
        var middlewares_registrados = app.$middlewares.getAll(middlewares);

        app.$route.post(part, middlewares_registrados, async (req, res) => {
            try {
                await callback(req, res);

                await app.events.emit('route.end', req, res);
            } catch (err) {
                res.error(err);
            }
        });
    }

    /**
     * Alias PUT
     */
    app.put = (part, callback, middlewares = []) => {
        var middlewares_registrados = app.$middlewares.getAll(middlewares);

        app.$route.put(part, middlewares_registrados, async (req, res) => {
            try {
                await callback(req, res);

                await app.events.emit('route.end', req, res);
            } catch (err) {
                res.error(err);
            }
        });
    }

    /**
     * Alias DELETE
     */
    app.delete = (part, callback, middlewares = []) => {
        var middlewares_registrados = app.$middlewares.getAll(middlewares);

        app.$route.delete(part, middlewares_registrados, async (req, res) => {
            try {
                await callback(req, res);

                await app.events.emit('route.end', req, res);
            } catch (err) {
                res.error(err) ;
            }
        });
    }

    // Register resources
    app.resource = (part, model, label, opts = {}) => {
        var middlewares = opts.middlewares ? opts.middlewares : [];

        const res = new Resource(part, model, label, opts);
    
        // Registrar rotas
        res.register(app, middlewares);
    }

    /**
     * Alias ALL
     */
    app.all = (part, callback, middlewares = []) => {
        var middlewares_registrados = app.$middlewares.getAll(middlewares);

        app.$route.all(part, middlewares_registrados, async (req, res) => {
            try {
                await callback(req, res);
                
                await app.events.emit('route.end', req, res);
            } catch (err) {
                res.error(err);
            }
        });
    }

    /**
     * Alias VERSION
     */
    app.version = version(app);

    /**
     * Registrar um novo middleware.
     * 
     * @param {string} id ID do middleware
     * @param {Function} callback Função do middleware
     */
    app.middleware = (id, callback) => {

        const callbakTratado = async (req, res, next, payload = {}) => {
            try {
                return await callback(req, res, next, payload);
            } catch (err) {
                return res.error(err);
            }
        };

        return app.$middlewares.register(id, callbakTratado);
    }

    /**
     * Registrar middlewares padrões.
     */
    app.middleware('auth',  Auth.auth());
    app.middleware('guest', Auth.guest());
    app.middleware('can',   Can.check());
}