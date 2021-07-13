module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', async (req, res) => {
        var opts = {};

        // Tratar includes
        resource.__queryIncludes(opts, req);

        // Carregar registro
        var obj = await resource.__getModelById(req.params.id, opts);

        // Verificar se foi implementado uma macro de controller (show)
        await resource.macro('show', [req, res, resource, obj]);

        res.json(obj);
    }, middlewares);
}