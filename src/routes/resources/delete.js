module.exports = (app, resource, middlewares) => {
    app.delete(resource.uri + '/:id?', async (req, res) => {
        var t = await resource.__transaction();
        try {
            // Carregar lista de ids
            var ids = req.params.id;
            if (ids == null) {
                ids = req.query.ids;
            }
            ids = (typeof ids == 'string') ? ids.split(',') : [];

            var count = 0;

            for (var i in ids) {
                var obj = await resource.__getModelById(ids[i], false);
                if (obj !== null) {

                    // Verificar se foi implementado uma macro de controller (delete)
                    if (typeof resource.controller.delete == 'function') {
                        await resource.controller.delete(req, res, resource, obj);
                    }

                    await obj.destroy();
                    count += 1;
                }
            }

            await t.commit();

            res.json({
                success: true,
                deleted: count
            });

        } catch (err) {
            await t.rollback();
            throw err;
        }
    }, middlewares);
}
