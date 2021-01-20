const auth = require('../auth');
const arr = require('rhinojs/support/arr');

const __applyWhereModelContext = (options, Model) => {

    // Verificar se where esta implementado
    if (!options.where) {
        options.where = {};
    }

    // Verificar se é por inquilino
    if (Model.byTenant) {
        var user = auth.user();
        if (user) {
            options.where.inquilino_id = user.inquilino_id;
        } else {
            options.where.inquilino_id = '?????';
        }
    }
    
    // Verificar se é por usuário
    if (Model.byUser) {
        var user = auth.user();
        if (user) {
            options.where.usuario_id = user.id;
        } else {
            options.where.usuario_id = '???';
        }
    }
}

module.exports = (Model) => {
    /**
     * Extender method model "findAll"
     */
    const __findAll = Model.findAll;
    Model.__findAll = __findAll;
    Model.findAll = async function(options = {}) {
        __applyWhereModelContext(options, Model);

        return await this.__findAll(options);
    }

    /**
     * Extender method model "findOne"
     */
    const __findOne = Model.findOne;
    Model.__findOne = __findOne;
    Model.findOne = async function(options = {}) {
        __applyWhereModelContext(options, Model);

        return await this.__findOne(options);
    }

    /**
     * Extender method model "save"
     */
    const __save = Model.prototype.save;
    Model.prototype.__save = __save;
    Model.prototype.save = async function(options = {}) {

        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);

        return await this.__save(options);
    }


    /**
     * Extender method model "destroy"
     */
    const __destroy = Model.prototype.destroy;
    Model.prototype.__destroy = __destroy;
    Model.prototype.destroy = async function(options = {}) {
        console.log('> destroy');

        __applyWhereModelContext(options, Model);
        
        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);
        
        var ret = await this.__destroy(options);
        console.log('> destroy 2');
        return ret;
    }


    /**
     * Extender method model "destroy"
     */
    const __destroyStatic = Model.destroy;
    Model.__destroy = __destroyStatic;
    Model.destroy = async function(options = {}) {
        console.log('> destroy static');

        __applyWhereModelContext(options, Model);

        // Verificar se deve atribuir a transacao atual
        this.db.transaction.apply(options);

        return await this.__destroy(options);
    }

    /**
     * Extender method model "toJson"
     */
    const __toJSON = Model.prototype.toJSON;
    Model.prototype.__toJSON = __toJSON;
    Model.prototype.toJSON = function() {
        var values = Object.assign({}, this.get());

        if (!this.constructor.hiddens) {
            return values;
        }

        arr.each(this.constructor.hiddens, (k, v) => {
            delete values[v];
        });


        return values;
    }
};