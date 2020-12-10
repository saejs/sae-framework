const arr = require("@rhinojs/support/src/arr");

class Resource {

    constructor(resourceUri, model, label) {
        this.uri = resourceUri;
        this.model = model;
        this.label = label;

        this.actions = {
            list   : { active: true, register: require('./resources/list') },
            create : { active: true, register: require('./resources/create') },
            edit   : { active: true, register: require('./resources/edit') },
            show   : { active: true, register: require('./resources/show') },
            store  : { active: true, register: require('./resources/store') },
            update : { active: true, register: require('./resources/update') },
            delete : { active: true, register: require('./resources/delete') }
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

    /**
     * Iniciar uma transacao no banco.
     * 
     * @returns {Object}
     */
    async __transaction() {
        var model = new resource.model();

        return await model.sequelize.transaction();
    }
}

module.exports = Resource;