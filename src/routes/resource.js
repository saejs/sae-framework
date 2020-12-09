const arr = require("@rhinojs/support/src/arr");

class Resource {

    constructor(resourceUri, model, label) {
        this.uri = resourceUri;
        this.model = model;
        this.label = label;

        this.actions = {
            list   : { active: true, register: this.__actionList },
            create : { active: true, register: this.__actionCreate },
            edit   : { active: true, register: this.__actionEdit },
            show   : { active: true, register: this.__actionShow },
            store  : { active: true, register: this.__actionStore },
            update : { active: true, register: this.__actionUpdate },
            delete : { active: true, register: this.__actionDelete }
        };
    }

    /**
     * Registrar rotas.
     */
    register(app) {
        arr.each(this.actions, (key, action) => {
            if (action.active) {
                action.register(app);
            }
        });
    }

    /**
     * Registrar rota LIST
     */
    __actionList(app) {
        app.$route.get(this.uri, (req, res) => {
            res.json({
                type: 'resource',
                action: 'LIST',
                method: 'GET',
                status: 'OK',
            });
        });
    }

    /**
     * Registrar rota CREATE
     */
    __actionCreate(app) {
        app.$route.get(this.uri + '/create', (req, res) => {
            res.json({
                type: 'resource',
                action: 'CREATE',
                method: 'GET',
                status: 'OK',
            });
        });
    }

    /**
     * Registrar rota EDIT
     */
    __actionEdit(app) {
        app.$route.get(this.uri + '/:id/edit', (req, res) => {
            res.json({
                type: 'resource',
                action: 'EDIT',
                method: 'GET',
                status: 'OK',
            });
        });
    }

    /**
     * Registrar rota SHOW
     */
    __actionShow(app) {
        app.$route.get(this.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', (req, res) => {
            res.json({
                type: 'resource',
                action: 'SHOW',
                method: 'GET',
                status: 'OK',
            });
        });
    }

    /**
     * Registrar rota STORE
     */
    __actionStore(app) {
        app.$route.post(this.uri, (req, res) => {
            res.json({
                type: 'resource',
                action: 'STORE',
                method: 'POST',
                status: 'OK',
            });
        });
    }

    /**
     * Registrar rota UPDATE
     */
    __actionUpdate(app) {
        app.$route.put(this.uri + '/:id', (req, res) => {
            res.json({
                type: 'resource',
                action: 'UPDATE',
                method: 'PUT',
                status: 'OK',
            });
        });
    }

    /**
     * Registrar rota DELETE
     */
    __actionDelete(app) {
        app.$route.delete(this.uri + '/:id?', (req, res) => {
            res.json({
                type: 'resource',
                action: 'DELETE',
                method: 'DELETE',
                status: 'OK',
            });
        });
    }

}

module.exports = Resource;