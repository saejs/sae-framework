const auth = require('../../auth');
const ApiError = require('../../api_error');

module.exports = (Model) => {

    /**
     * Definições
     */
    Model.context = {
        // flags
        byTenant: false,
        byUser  : false,

        // configs
        tenant_attr: 'inquilino_id',
        user_attr  : 'user_id',
    };

    /**
     * Informar attributo por inquilino.
     */
    Model.prototype.__setAttributesTenant = () => {
        // Verificar se é por inquilino
        if (!this.constructor.context.byTenant) {
            return false;            
        }

        // Verificar se atributo já foi informado
        if (this[this.constructor.context.tenant_attr]) {
            return false;
        }

        // Verificar se usuário esta logado
        var user = auth.user();
        if (!user) {
            throw new ApiError('erro.auth.sem.contexto');
        }

        // Atribuir attributo do model pelo inquilino logado do usuario.
        this[this.constructor.context.tenant_attr] = user[this.constructor.context.tenant_attr];

        return true;
    }

    /**
     * Informar attributo por usuario.
     */
    Model.prototype.__setAttributesUser = () => {
        // Verificar se é por usuario
        if (!this.constructor.context.byUser) {
            return false;            
        }

        // Verificar se atributo já foi informado
        if (this[this.constructor.context.user_attr]) {
            return false;
        }

        // Verificar se usuário esta logado
        var user = auth.user();
        if (!user) {
            throw new ApiError('erro.auth.sem.contexto');
        }

        // Atribuir attributo do model pelo usuario logado do usuario.
        this[this.constructor.context.user_attr] = user.id;

        return true;
    }


    /**
     * Atribuir controle de contexto.
     */
    Model.prototype.setAttributesContext = () => {
        // Verificar se é por inquilino
        this.__setAttributesTenant();

        // Verificar se é por usuário
        this.__setAttributesUser();
    }

    /**
     * Se for por inquilino, add filtro.
     * 
     * @param {Object} options 
     */
    Model.__setWhereContextTenant = (options) => {
        // Verificar se é por inquilino
        if (!this.context.byTenant) {
            return false;            
        }

        var user = auth.user();

        // Verificar se usuario esta logado
        if (user) {
            options.where[this.context.tenant_attr] = user[this.context.tenant_attr];
        } else {
            options.where[this.context.tenant_attr] = '???';
        }

        return true;
    }

    /**
     * Se for por usuario, add filtro.
     * 
     * @param {Object} options 
     */
    Model.__setWhereContextUser = (options) => {
        // Verificar se é por usuario
        if (!this.context.byUser) {
            return false;            
        }

        var user = auth.user();

        // Verificar se usuario esta logado
        if (user) {
            options.where[this.context.user_attr] = user.id;
        } else {
            options.where[this.context.user_attr] = '???';
        }

        return true;
    }

    /**
     * Aplicar 
     * @param {Object} options 
     */
    Model.setWhereContext = (options) => {
        options = (options == undefined) ? {} : options;

        // Verificar se where esta implementado
        if (!options.where) {
            options.where = {};
        }

        // Verificar se é por inquilino
        this.__setWhereContextTenant(options);

        // Verificar se é por usuario
        this.__setWhereContextUser(options);
    }
}