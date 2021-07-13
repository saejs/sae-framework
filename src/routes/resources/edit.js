module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id/edit', async (req, res) => {
        var opts = {};

        // Tratar includes
        resource.__queryIncludes(opts, req);

        // Carregar registro
        var obj = await resource.__getModelById(req.params.id, opts);

        // Aplicar valores default quando entra em modo edição
        //..

        // Verificar se foi implementado uma macro de controller (edit)
        await resource.macro('edit', [req, res, resource, obj]);

        res.json(obj);
    }, middlewares);
}
