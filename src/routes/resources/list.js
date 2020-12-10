/**
 * Aplicar filtros.
 */
function listApply_filter(query, req) {
    //..
}

/**
 * Aplicar ordenacao.
 * ?sort=campo.asc,campo1.desc,campo2 - quando nao informado .asc|desc assumir asc
 */
function listApply_orders(query, req) {
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
function listApply_pages(query, req) {
    // Limit
    if (req.query.limit) {
        query.limit = req.query.limit;
    }

    // Offset
    if (req.query.offset) {
        query.offset = req.query.offset;
    }
}

module.exports = (app, resource) => {
    app.get(resource.uri, async (req, res) => {

        // Gerar nova query
        var query = {};

        // Aplicar filtros
        listApply_filter(query, req);

        // Aplicar ordenação
        listApply_orders(query, req);

        // Aplicar paginação
        listApply_pages(query, req);

        // Carregar registros
        var all = await resource.model.findAll(query);

        // Retorno
        res.json(all);
    });
}
