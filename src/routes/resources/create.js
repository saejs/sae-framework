module.exports = (app, resource, middlewares) => {
    app.get(resource.uri + '/create', async (req, res) => {
        var obj = new resource.model();

        // Carregar valores default
        //...

        res.json(obj);
    }, middlewares);
}
