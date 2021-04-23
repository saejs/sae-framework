const arr = require("rhinojs/support/arr");
const ApiError = require("../api_error");

class Resource {

    constructor(resourceUri, model, label, opts = {}) {
        this.uri   = resourceUri;
        this.model = model;
        this.label = label;
        
        this.opts  = {};
        Object.assign(this.opts, opts);

        this.actions = {
            list   : { active: arr.get(this.opts, 'actions.list', true),   register: require('./resources/list') },
            create : { active: arr.get(this.opts, 'actions.create', true), register: require('./resources/create') },
            edit   : { active: arr.get(this.opts, 'actions.edit', true),   register: require('./resources/edit') },
            show   : { active: arr.get(this.opts, 'actions.show', true),   register: require('./resources/show') },
            store  : { active: arr.get(this.opts, 'actions.store', true),  register: require('./resources/store') },
            update : { active: arr.get(this.opts, 'actions.update', true), register: require('./resources/update') },
            delete : { active: arr.get(this.opts, 'actions.delete', true), register: require('./resources/delete') }
        };
    }

    /**
     * Registrar rotas.
     */
    register(app, middlewares = []) {
        var $this = this;

        arr.each(this.actions, (key, action) => {
            if (action.active) {
                action.register(app, $this, middlewares);
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
                throw ApiError('error.model.nao.encontrado', { label: this.label, id: id});
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
        var model = new this.model();

        return await model.$db.transaction.start();
    }

    /**
     * Retorna a lista de atributos para a busca.
     * 
     * @returns {Array}
     */
    get searchAttrs() {
        return arr.get(this.opts, 'search', []);
    }

    /**
     * Retorna o macro do resource.
     * 
     * @returns {Object}
     */
    get macroController() {
        return arr.get(this.opts, 'macro', {});
    }

    /**
     * Retorna um variavel do option.
     * 
     * @param {String} key Nome do atributo do option 
     * @param {any} def Valor padrao
     * @returns {any}
     */
    option(key, def = null) {
        return arr.get(this.opts, key, def);
    }

    /**
     * Executar o evento do controller.
     */
    async macro(event, args) {
        var evCall = this.macroController[event];
        if (typeof evCall == 'function') {
            await evCall.apply(null, args);
        }
    }

}

module.exports = Resource;