const arr = require("rhinojs/support/arr");

module.exports = (app, resource, middlewares) => {
    app.post(resource.uri, async (req, res) => {
        console.log('res.store.ini');
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

            console.log('res.store.commit.1');
            await t.commit();
            console.log('res.store.commit.2');

            res.json(obj);
        } catch (err) {
            console.log('res.store.rollback.1');
            await t.rollback();
            console.log('res.store.rollback.1');
            throw err;
        }
    }, middlewares);
}
