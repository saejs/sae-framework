const arr = require("@rhinojs/support/src/arr");

module.exports = (app, resource) => {
    app.post(resource.uri, async (req, res) => {
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
