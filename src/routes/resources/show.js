module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', middlewares, async (req, res) => {
        var obj = await resource.__getModelById(req.params.id);

        res.json(obj);
    });
}