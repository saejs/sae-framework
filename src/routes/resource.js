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
     * @param {String} id Id of model
     * @param {Object} opts Opcoes da busca
     * @param {Boolean} createException Has create exception
     * @returns {Object}
     */
    async __getModelById(id, opts = {}, createException = true) {
        // Tratar where
        if (!opts.where) {
            opts.where = {};
        }

        // Set ID filter
        opts.where['id'] = id;

        // Set route filters
        this.__applyWhereRoute(opts.where);

        // Procurar registro
        var model = await this.model.findOne(opts);

        // Verificar sew entrou um registro
        if (model == null) {
            if (createException) {
                throw new ApiError('error.model.nao.encontrado', { label: this.label, id: id});
            }

            return null;
        }

        return model;
    }

    /**
     * Aplicar include no queru pelo req.query.
     * 
     * @param {Object} query 
     * @param Object} req 
     * @returns 
     */
    __queryIncludes(query, req) {
        var incs = req.query('includes');
        if (!incs) {
            return;
        }

        if (typeof incs == 'string') {
             incs = incs.split(',');
        }    

        query.include = incs;
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
     * Aplicar where da rota no where da busca.
     * 
     * @param {Object} where 
     */
    __applyWhereRoute(where) {
        if (!this.modelWhere) {
            return;
        }

        var keys = Object.keys(this.modelWhere);
        for (var id of keys) {
            where[id] = this.modelWhere[id];
        }        
    }

    /**
     * Aplicar defults attributes da rota.
     * 
     * @param {Object} where 
     */
    __applyDefaultAttributesRoute(model) {
        if (!this.modelDefaults) {
            return;
        }

        var keys = Object.keys(this.modelDefaults);
        for (var attr of keys) {
            model[attr] = this.modelDefaults[attr];
        }        
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
     * Retorna o where para o model.
     * 
     * @returns {Object|null}
     */
    get modelWhere() {
        return arr.get(this.opts, 'where', null);
    }

    /**
     * Retorna o defaults attributes para o model da rota.
     * 
     * @returns {Object|null}
     */
    get modelDefaults() {
        return arr.get(this.opts, 'defaults', null);
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

    /**
     * Retorna o id do parent.
     * 
     * @param {Object} req Request
     * @returns {any}
     */
    getParentId(req) {
        var parent = this.option('parent');

        if ((!parent) || (!parent.attr)) {
            return null;
        }

        var modo = parent.mode ? parent.mode : 'param';

        // Query
        if (modo == 'query') {
            return {
                attr    : parent.attr,
                value   : req.query(parent.attr, null),
                showall : parent.showall ? true : false,
                mode    : 'query',
            }
        }

        // Param
        return {
            attr    : parent.attr,
            value   : req.params[parent.attr] ? req.params[parent.attr] : null,
            showall : parent.showall ? true : false,
            mode    : 'param',
        };
    }

}

module.exports = Resource;