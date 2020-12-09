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
        var $this = this;

        arr.each(this.actions, (key, action) => {
            if (action.active) {
                action.register(app, $this);
            }
        });
    }

    /**
     * Registrar rota LIST
     */
    __actionList(app, resource) {
        app.get(resource.uri, async (req, res) => {
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
    __actionCreate(app, resource) {
        app.get(resource.uri + '/create', async (req, res) => {
            var obj = new resource.model();

            // Carregar valores default
            //...

            res.json(obj);
        });
    }

    /**
     * Registrar rota EDIT
     */
    __actionEdit(app, resource) {
        app.get(resource.uri + '/:id/edit', async (req, res) => {
            var obj = await resource.__getModelById(req.params.id);

            // Aplicar valores default quando entra em modo edição
            //..

            res.json(obj);
        });
    }

    /**
     * Registrar rota SHOW
     */
    __actionShow(app, resource) {
        app.get(resource.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', async (req, res) => {
            var obj = await resource.__getModelById(req.params.id);

            res.json(obj);
        });
    }

    /**
     * Registrar rota STORE
     */
    __actionStore(app, resource) {
        app.post(resource.uri, async (req, res) => {
            var model = new resource.model();

            var t = await model.sequelize.transaction();
            try {
                var json = req.body;

                arr.each(json, (key, value) => {
                    model[key] = value;
                });

                await model.save();

                await t.commit();

                res.json(model);
            } catch (err) {
                await t.rollback();
                throw err;
            }
        });
    }

    /**
     * Registrar rota UPDATE
     */
    __actionUpdate(app, resource) {
        app.put(resource.uri + '/:id', async (req, res) => {
            var model = new resource.model();

            var t = await model.sequelize.transaction();
            try {
                var json = req.body;

                var obj = await resource.__getModelById(req.params.id);

                arr.each(json, (key, value) => {
                    obj[key] = value;
                });

                await obj.save();

                await t.commit();

                res.json(obj);
            } catch (err) {
                await t.rollback();
                throw err;
            }
        });
    }

    /**
     * Registrar rota DELETE
     */
    __actionDelete(app, resource) {
        app.delete(resource.uri + '/:id?', async (req, res) => {
            var model = new resource.model();

            var t = await model.sequelize.transaction();
            try {
                // Carregar lista de ids
                var ids = req.params.id;
                if (ids == null) {
                    ids = req.query.ids;
                }
                ids = (typeof ids == 'string') ? ids.split(',') : [];

                var count = 0;

                for (var i in ids) {
                    var obj = await resource.__getModelById(ids[i], false);
                    if (obj !== null) {
                        await obj.destroy();
                        count += 1;
                    }
                }

                await t.commit();

                res.json({
                    success: true,
                    deleted: count
                });
                
            } catch (err) {
                await t.rollback();
                throw err;
            }
        });
    }

    /**
     * Load model by Id.
     * 
     * @param {String} id Od of model
     * @param {Boolean} createException Has create exception
     * @returns {Object}
     */
    async __getModelById(id, createException = true) {
        var model = await this.model.findByPk(id);

        if (model == null) {
            if (createException) {
                throw new Error(`${this.label} [${id}] nao foi encontrado`);
            }

            return null;
        }

        return model;
    }
}

module.exports = Resource;