module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id/edit', async (req, res) => {
        var obj = await resource.__getModelById(req.params.id);

        // Aplicar valores default quando entra em modo edição
        //..

        // Verificar se foi implementado uma macro de controller (edit)
        if (typeof resource.controller.edit == 'function') {
            await resource.controller.edit(req, res, resource, obj);
        }

        res.json(obj);
    }, middlewares);
}
