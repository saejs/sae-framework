const auth = require('../../../auth');

module.exports = (schemaModel, opts, app) => {

    /**
     * Definições
     */
    schemaModel.set('by_tenant',         false);
    schemaModel.set('tenant_attr',       'inquilino_id');
    schemaModel.set('uncontext_tenant',  false);
    
    schemaModel.set('by_user',           false);
    schemaModel.set('user_attr',         'usuario_id');
    schemaModel.set('uncontext_user',    false);

    schemaModel.set('by_company',        false);
    schemaModel.set('company_attr',      'empresa_id');
    schemaModel.set('uncontext_company', false);

    const inquilino      = require('./contextos/inquilino')(schemaModel, auth, opts);
    const usuario        = require('./contextos/usuario')(schemaModel, auth, opts);
    const empresa        = require('./contextos/empresa')(schemaModel, auth, opts, app);
    const attrs_contexto = require('./contextos/attr_contexto')(schemaModel, auth, opts, app);

    /**
     * Aplicar atributos de contexto no save
     */
    schemaModel.pre('save', async function () {

        // Aplicar atributo do inquilino
        inquilino.setAttr(this);

        // Aplicar atributo do usuário
        usuario.setAttr(this);

        // Aplicar atributo do empresa
        await empresa.setAttr(this);

        // Aplicar contexto dos atributos (usuario, empresa...)
        await attrs_contexto.setAttr(this);

    });

    /**
     * Aplicar filtros de contexto dos finds
     */
    schemaModel.pre(['find', 'findOne'], async function () {

        var query = this.getQuery();

        // Aplicar filtro do inquilino
        inquilino.setWhere(query);

        // Aplicar filtro do usuario
        usuario.setWhere(query);

        // Aplicar filtro da empresa
        await empresa.setWhere(query);

        // Atribuir novo query
        this.setQuery(query);
    });

    /**
     * Add static method uncontext_tenant
     */
    schemaModel.static('uncontextTenant', function() {
        schemaModel.set('uncontext_tenant', true);
        return this;
    });

    /**
     * Add static method uncontext_user
     */
    schemaModel.static('uncontextUser', function() {
        schemaModel.set('uncontext_user', true);
        return this;
    });

    /**
     * Add static method uncontext_company
     */
    schemaModel.static('uncontextCompany', function() {
        schemaModel.set('uncontext_company', true);
        return this;
    });
}