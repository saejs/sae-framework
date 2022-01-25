const str = require('rhinojs/support/str');

module.exports = (Model) => {

    const __touchAttribute = async (model, attrId, attr) => {

        // Montar method get
        attrId = str.replaceAll('_id', '', attrId);
        var method = 'get' + str.studly(attrId);

        // Carregar model estrangeiro 
        var est = await model[method]();
        if (!est) {
            return null;
        }

        // Executar o touch
        await est.executeTouch({ inSave: false });
    };


    Model.prototype.executeTouch = async function (options) {

        // Executar o touch
        if (typeof this.touch == 'function') {
            await this.touch(options);

            // Veriifcar se deve dar o save
            if (!options.inSave) {
                await this.save();
            }
        }
    }


    Model.prototype.touchAttributes = async function (options) {

        // Verificar se deve ignorar os touches
        if (options.touches === false) {
            return;
        }

        // Carregar atributos
        var attrs = this.constructor.rawAttributes;
        var ids = Object.keys(attrs);
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var attr = attrs[id];

            if (!attr.touch) {
                continue;
            }

            await __touchAttribute(this, id, attr);
        }
    }
}