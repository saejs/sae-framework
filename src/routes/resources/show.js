module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', async (req, res) => {
        var obj = await resource.__getModelById(req.params.id);

        // Verificar se foi implementado uma macro de controller (show)
        if (typeof resource.controller.show == 'function') {
            await resource.controller.show(req, res, resource, obj);
        }

        res.json(obj);
    }, middlewares);
}