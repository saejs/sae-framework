module.exports = (app, resource) => {
    app.get(resource.uri + '/create', async (req, res) => {
        var obj = new resource.model();

        // Carregar valores default
        //...

        res.json(obj);
    });
}
