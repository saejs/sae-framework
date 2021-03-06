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
    Model.prototype.__setAttributesTenant = (model) => {
        // Verificar se é por inquilino
        if (!model.constructor.context.byTenant) {
            return false;            
        }

        // Verificar se atributo já foi informado
        if (model[model.constructor.context.tenant_attr]) {
            return false;
        }

        // Verificar se usuário esta logado
        var user = auth.user();
        if (!user) {
            throw new ApiError('erro.auth.sem.contexto');
        }

        // Atribuir attributo do model pelo inquilino logado do usuario.
        model[model.constructor.context.tenant_attr] = user[model.constructor.context.tenant_attr];

        return true;
    }

    /**
     * Informar attributo por usuario.
     */
    Model.prototype.__setAttributesUser = (model) => {
        // Verificar se é por usuario
        if (!model.constructor.context.byUser) {
            return false;            
        }

        // Verificar se atributo já foi informado
        if (model[model.constructor.context.user_attr]) {
            return false;
        }

        // Verificar se usuário esta logado
        var user = auth.user();
        if (!user) {
            throw new ApiError('erro.auth.sem.contexto');
        }

        // Atribuir attributo do model pelo usuario logado do usuario.
        model[model.constructor.context.user_attr] = user.id;

        return true;
    }


    /**
     * Atribuir controle de contexto.
     */
    Model.prototype.setAttributesContext = (model) => {
        // Verificar se é por inquilino
        model.__setAttributesTenant(model);

        // Verificar se é por usuário
        model.__setAttributesUser(model);
    }

    /**
     * Se for por inquilino, add filtro.
     * 
     * @param {Object} options 
     */
    Model.__setWhereContextTenant = (model, options) => {
        // Verificar se é por inquilino
        if (!model.context.byTenant) {
            return false;            
        }

        var user = auth.user();

        // Verificar se usuario esta logado
        if (user) {
            options.where[model.context.tenant_attr] = user[model.context.tenant_attr];
        } else {
            options.where[model.context.tenant_attr] = '???';
        }

        return true;
    }

    /**
     * Se for por usuario, add filtro.
     * 
     * @param {Object} options 
     */
    Model.__setWhereContextUser = (model, options) => {
        // Verificar se é por usuario
        if (!model.context.byUser) {
            return false;            
        }

        var user = auth.user();

        // Verificar se usuario esta logado
        if (user) {
            options.where[model.context.user_attr] = user.id;
        } else {
            options.where[model.context.user_attr] = '???';
        }

        return true;
    }

    /**
     * Aplicar 
     * @param {Object} options 
     */
    Model.setWhereContext = (model, options) => {
        options = (options == undefined) ? {} : options;

        // Verificar se deve ignorar o contexto
        if (options.uncontext) {
            return false;
        }

        // Verificar se where esta implementado
        if (!options.where) {
            options.where = {};
        }

        // Verificar se é por inquilino
        model.__setWhereContextTenant(model, options);

        // Verificar se é por usuario
        model.__setWhereContextUser(model, options);
    }
}