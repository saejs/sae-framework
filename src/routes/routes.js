const version = require('./version');
const Resource = require('./resource');
const arr = require("@rhinojs/support/src/arr");

module.exports = (app) => {
    /**
     * Alias GET
     */
    app.get = (part, callback) => {
        app.$route.get(part, async (req, res) => {
            try {
                await callback(req, res);
            } catch (err) {
                res.error(err, 4000);
            }
        });
    }

    /**
     * Alias POST
     */
    app.post = (part, callback) => {
        app.$route.post(part, async (req, res) => {
            try {
                await callback(req, res);
            } catch (err) {
                res.error(err, 4000);
            }
        });
    }

    /**
     * Alias PUT
     */
    app.put = (part, callback) => {
        app.$route.put(part, async (req, res) => {
            try {
                await callback(req, res);
            } catch (err) {
                res.error(err);
            }
        });
    }

    /**
     * Alias DELETE
     */
    app.delete = (part, callback) => {
        app.$route.delete(part, async (req, res) => {
            try {
                await callback(req, res);
            } catch (err) {
                res.error(err, 4000) ;
            }
        });
    }

    // Register resources
    app.resource = (part, model, label, actions = {}) => {
        const res = new Resource(part, model, label);

        // Ativar ou desativar actions
        arr.each(res.actions, (key, action) => {
            action.active = arr.get(actions, key, true);
        });
    
        // Registrar rotas
        res.register(app);
    }

    /**
     * Alias ALL
     */
    app.all = (part, callback) => {
        app.$route.all(part, async (req, res) => {
            try {
                await callback(req, res);
            } catch (err) {
                res.error(err, 4000);
            }
        });
    }

    /**
     * Alias VERSION
     */
    app.version = version(app);
}