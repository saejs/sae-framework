const arr = require("rhinojs/support/arr");

module.exports = (app, resource) => {
    app.put(resource.uri + '/:id', async (req, res) => {
        var t = await resource.__transaction();
        try {
            var json = req.body;

            var obj = await resource.__getModelById(req.params.id);

            arr.each(json, (key, value) => {
                obj[key] = value;
            });

            await obj.save();

            await t.commit();

            res.json(obj);
        } catch (err) {
            await t.rollback();
            throw err;
        }
    });
}
