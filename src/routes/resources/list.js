const Arr = require('rhinojs/support/arr');
const Str = require('rhinojs/support/str');
const { Op } = require('sequelize');

/**
 * Aplicar filtros.
 */
function listApply_filter(query, req, resource) {
    query.where = {};

    // Route
    resource.__applyWhereRoute(query.where);

    // Search
    listApply_filter_search(query, req, resource);

    // Atributes
    listApply_filter_attributes(query, req, resource);
}

/**
 * Aplicar filtros da busca.
 */
function listApply_filter_search(query, req, resource) {
    if (!req.query('q')) {
        return;
    }

    var q = req.query('q');
    var attrs = resource.searchAttrs;
    if (attrs.length == 0) {
        return;
    }

    var wheres = [];

    Arr.each(attrs, (k, attr) => {
        var where = {};
        where[attr] = {
            [Op.like] : '%' + q + '%'
        }
        wheres.push(where);
    });

    if (wheres.length > 0) {
        query.where[Op.or] = wheres;
    }
}

/**
 * Aplicar filtros dos atributos.
 */
function listApply_filter_attributes(query, req, resource) {
    // Aplicar filtro do parent
    var parent = resource.getParentId(req);
    var parent_attr = null;
    if (parent) {
        parent_attr = parent.attr;
        if (!parent.value) {
            if (!parent.showall) {
                query.where[parent.attr] = { 
                    [Op.is]: null
                };
            }
        } else {
            query.where[parent.attr] = parent.value;            
        }
    }

    // Aplicar os outros atributos mas excluir o atributo "parent"
    //var attrs = Arr.except(req.__query, ['sort','q','limit','offset', parent_attr]);
    for (var key in req.__query) {
        if (Str.is('__*', key)) {
            var attr = key.substring(2);
            query.where[attr] = req.__query[key];
        }
    }
}

/**
 * Aplicar ordenacao.
 * ?sort=campo.asc,campo1.desc,campo2 - quando nao informado .asc|desc assumir asc
 */
function listApply_orders(query, req, resource) {
    if (!req.query('sort')) {
        return;
    }

    query.order = [];

    var exp = /^([A-Za-z0-9_]+)(\.(asc|desc){1})*$/;

    var sorts = req.query('sort', '').split(',');
    for (var i in sorts) {
        var match = exp.exec(sorts[i]);
        if (match) {
            var attr = match[1];
            var dir = match[3] ? match[3] : 'asc';

            query.order.push([ attr, dir.toUpperCase() ]);
        }
    }
}

/**
 * Aplicar paginacao.
 * ?limit=10
 * ?offset=3
 */
function listApply_pages(query, req, resource) {
    // Limit
    query.limit = Number(req.query('limit', 50));

    // Offset
    query.offset = Number(req.query('offset', 0));
}

module.exports = (app, resource, middlewares) => {
    app.get(resource.uri, async (req, res) => {

        // Gerar nova query
        var query = {};
        var queryCount = {};

        // Aplicar filtros
        listApply_filter(query, req, resource);
        listApply_filter(queryCount, req, resource);

        // Aplicar ordenação
        listApply_orders(query, req, resource);

        // Aplicar paginação
        listApply_pages(query, req, resource);

        // Aplicar includes
        resource.__queryIncludes(query, req);

        // Verificar se foi implementado uma macro de controller (list)
        await resource.macro('list', [req, res, resource, query]);
        await resource.macro('list', [req, res, resource, queryCount]);

        // Carregar qtdade de registros total sem paginacao
        var count = await resource.model.count(queryCount);

        // Carregar registros
        var lista = await resource.model.findAll(query);

        // Retorno
        res.json({
            count,
            lista,
        });
    }, middlewares);
}