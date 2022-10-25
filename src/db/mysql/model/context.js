//const auth = require('../../../auth');
//const ApiError = require('../../../api_error');

module.exports = (Model) => {

    /**
     * Definições
     */
    Model.context = {
        // flags
        byTenant  : false,
        byUser    : false,
        byCompany : false,

        // configs
        tenant_attr  : 'inquilino_id',
        user_attr    : 'usuario_id',
        company_attr : 'empresa_id',
    };

    // Helpers contexto
    const inquilino = require('./contextos/inquilino')(Model);
    const usuario = require('./contextos/usuario')(Model);
    const empresa = require('./contextos/empresa')(Model);
    const attrs_contexto = require('./contextos/attrs_contexto')(Model);

    /**
     * Atribuir controle de contexto.
     */
    Model.prototype.setAttributesContext = async (model) => {

        // Verificar se é por inquilino
        await inquilino.setAttr(model);

        // Verificar se é por usuário
        await usuario.setAttr(model);

        // Verificar se é por empresa
        await empresa.setAttr(model);

        // Assumir contexto 
        await attrs_contexto.setAttr(model);
    }

    /**
     * Aplicar 
     * @param {Object} options 
     */
    Model.setWhereContext = async (model, options) => {
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
        await inquilino.setWhere(model, options);

        // Verificar se é por usuario
        await usuario.setWhere(model, options);

        // Verificar se é por empresa
        await empresa.setWhere(model, options);
    }
}