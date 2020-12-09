const version = require('./version');

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

    /**
     * Alias VERSION
     */
    app.version = version(app);
}