module.exports = (app, resource) => {
    app.get(resource.uri + '/:id(((?!create)[0-9a-zA-Z]+)+)', async (req, res) => {
        var obj = await resource.__getModelById(req.params.id);

        res.json(obj);
    });
}