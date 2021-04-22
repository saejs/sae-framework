const Arr = require('rhinojs/support/arr');
const { Op } = require('sequelize');

/**
 * Aplicar filtros.
 */
function listApply_filter(query, req, resource) {
    query.where = {};

    // Search
    listApply_filter_search(query, req, resource);

    // Atributes
    listApply_filter_attributes(query, req, resource);
}

/**
 * Aplicar filtros da busca.
 */
function listApply_filter_search(query, req, resource) {
    if (!req.query.q) {
        return;
    }

    var q = req.query.q;
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
    //..
}

/**
 * Aplicar ordenacao.
 * ?sort=campo.asc,campo1.desc,campo2 - quando nao informado .asc|desc assumir asc
 */
function listApply_orders(query, req, resource) {
    if (!req.query.sort) {
        return;
    }

    query.order = [];

    var exp = /^([A-Za-z0-9_]+)(\.(asc|desc){1})*$/;

    var sorts = req.query.sort.split(',');
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
    if (req.query.limit) {
        query.limit = req.query.limit;
    }

    // Offset
    if (req.query.offset) {
        query.offset = req.query.offset;
    }
}

module.exports = (app, resource, middlewares) => {
    app.get(resource.uri, async (req, res) => {

        // Gerar nova query
        var query = {};

        // Aplicar filtros
        listApply_filter(query, req, resource);

        // Aplicar ordenação
        listApply_orders(query, req, resource);

        // Aplicar paginação
        listApply_pages(query, req, resource);

        // Verificar se foi implementado uma macro de controller (list)
        if (typeof resource.controller.list == 'function') {
            await resource.controller.list(req, res, resource, query);
        }

        // Carregar registros
        var all = await resource.model.findAll(query);

        // Retorno
        res.json(all);
    }, middlewares);
}
