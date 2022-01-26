const arr = require("rhinojs/support/arr");

module.exports = (app, resource, middlewares) => {
    app.post(resource.uri, async (req, res) => {
        var t = await resource.__transaction();
        try {
            var json = req.body;

            var obj = new resource.model();

            // Aplicar defaults da rota
            resource.__applyDefaultAttributesRoute(obj);

            // Aplicar parent
            var parent = resource.getParentId(req);
            if ((parent) && (parent.value)) {
                obj[parent.attr] = parent.value;
            }

            // Aplicar atributos
            arr.each(json, (key, value) => {
                obj[key] = value;
            });

            // Verificar se foi implementado uma macro de controller (before store)
            await resource.macro('creating', [req, res, resource, obj]);

            await obj.save();

            // Verificar se foi implementado uma macro de controller (after store)
            await resource.macro('created', [req, res, resource, obj]);

            await t.commit();

            res.json(obj);
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }, middlewares);
}
