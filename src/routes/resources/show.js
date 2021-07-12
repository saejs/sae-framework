module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', async (req, res) => {
        var opts = {};

        // Tratar includes
        opts.include = req.query('includes', []);
        if (typeof opts.include == 'string') {
            opts.include = opts.include.split(',');
        }

        // Carregar registro
        var obj = await resource.__getModelById(req.params.id, opts);

        // Verificar se foi implementado uma macro de controller (show)
        await resource.macro('show', [req, res, resource, obj]);

        res.json(obj);
    }, middlewares);
}