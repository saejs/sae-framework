const version = require('./version');
const Resource = require('./resource');

module.exports = (app) => {
    /**
     * Alias GET
     */
    app.get = (part, callback) => {
        app.$route.get(part, async (req, res) => {
            try {
                await callback(req, res);
            } catch (err) {
                res.error(err);
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
                res.error(err);
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
                res.error(err) ;
            }
        });
    }

    // Register resources
    app.resource = (part, model, label, opts = {}) => {
        const res = new Resource(part, model, label, opts);
    
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
                res.error(err);
            }
        });
    }

    /**
     * Alias VERSION
     */
    app.version = version(app);
}