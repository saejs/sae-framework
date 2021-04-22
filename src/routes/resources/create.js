module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/create', async (req, res) => {
        var obj = new resource.model();

        // Carregar valores default
        //...

        // Verificar se foi implementado uma macro de controller (create)
        if (typeof resource.controller.create == 'function') {
            await resource.controller.create(req, res, resource, obj);
        }

        res.json(obj);
    }, middlewares);
}
