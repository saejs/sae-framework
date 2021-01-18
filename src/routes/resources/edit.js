module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id/edit', async (req, res) => {
        var obj = await resource.__getModelById(req.params.id);

        // Aplicar valores default quando entra em modo edição
        //..

        res.json(obj);
    }, middlewares);
}
