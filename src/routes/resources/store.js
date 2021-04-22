const arr = require("rhinojs/support/arr");

module.exports = (app, resource, middlewares) => {
    app.post(resource.uri, async (req, res) => {
        var t = await resource.__transaction();
        try {
            var json = req.body;

            var obj = new resource.model();

            arr.each(json, (key, value) => {
                obj[key] = value;
            });

            // Verificar se foi implementado uma macro de controller (store)
            if (typeof resource.controller.store == 'function') {
                await resource.controller.store(req, res, resource, obj);
            }
            
            await obj.save();

            await t.commit();

            res.json(obj);
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }, middlewares);
}
