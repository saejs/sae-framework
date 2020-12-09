const version = require('./version');
const Resource = require('./resource');
const arr = require("@rhinojs/support/src/arr");

module.exports = (app) => {
    /**
     * Alias GET
     */
    app.get = (part, callback) => {
        return app.$route.get(part, callback);
    }

    /**
     * Alias POST
     */
    app.post = (part, callback) => {
        return app.$route.post(part, callback);
    }

    /**
     * Alias PUT
     */
    app.put = (part, callback) => {
        return app.$route.put(part, callback);
    }

    /**
     * Alias DELETE
     */
    app.delete = (part, callback) => {
        return app.$route.delete(part, callback);
    }

    // Register resources
    app.resource = (part, model, label, actions = {}) => {
        const res = new Resource(part, model, label);

        // Ativar ou desativar actions
        arr.each(res.actions, (key, action) => {
            action.active = arr.get(actions, action, true);
        });
    
        // Registrar rotas
        res.register(app);
    }

    /**
     * Alias VERSION
     */
    app.version = version(app);
}