const arr = require("rhinojs/support/arr");

module.exports = (app, resource, middlewares) => {
    app.put(resource.uri + '/:id', async (req, res) => {
        var t = await resource.__transaction();
        try {
            var json = req.body;

            var obj = await resource.__getModelById(req.params.id);

            arr.each(json, (key, value) => {
                obj[key] = value;
            });

            // Verificar se foi implementado uma macro de controller (before update)
            await resource.macro('updating', [req, res, resource, obj]);
            
            await obj.save();

            // Verificar se foi implementado uma macro de controller (after update)
            await resource.macro('updated', [req, res, resource, obj]);

            await t.commit();

            res.json(obj);
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }, middlewares);
}
