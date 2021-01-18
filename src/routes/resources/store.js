const arr = require("rhinojs/support/arr");

module.exports = (app, resource, middlewares) => {
    app.post(resource.uri, middlewares, async (req, res) => {
        var t = await resource.__transaction();
        try {
            var json = req.body;

            var obj = new resource.model();

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
