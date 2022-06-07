module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/create', async (req, res) => {
        var obj = new resource.model();

        // Carregar valores default
        //...

        // Verificar se foi implementado uma macro de controller (create)
        await resource.macro('create', [req, res, resource, obj]);

        // Zerar o ID para identiifcar o insert        
        res.json(Object.assign({}, obj.toJSON(), { id: null }));
    }, middlewares);
}
