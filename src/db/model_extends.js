const arr = require('rhinojs/support/arr');

module.exports = (Model) => {
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

        // Verificar se deve atribuir a transacao atual
        this.$db.transaction.apply(options);

        return await this.__destroy(options);
    }


    /**
     * Extender method model "destroy"
     */
    const __destroyStatic = Model.destroy;
    Model.__destroy = __destroyStatic;
    Model.destroy = async function(options = {}) {

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