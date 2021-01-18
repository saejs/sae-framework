module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id/edit', middlewares, async (req, res) => {
        var obj = await resource.__getModelById(req.params.id);

        // Aplicar valores default quando entra em modo edição
        //..

        res.json(obj);
    });
}
