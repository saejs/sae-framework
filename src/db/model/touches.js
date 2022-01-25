const str = require('rhinojs/support/str');

module.exports = (Model) => {

    const __herdarAttribute = async (model, attrId, attr) => {

        if (typeof attr.herdar == 'string') {
            var attrLocal   = attr.herdar;
            var attrDestino = attrId;    
        } else {
            var attrLocal   = attr.herdar.local;
            var attrDestino = attr.herdar.destino ? attr.herdar.destino : attrId;
        }


        // Verificar se os atributos foram informados
        if ((!attrLocal) || (!attrDestino)) {
            return null;
        }

        // Montar method get
        var method = 'get' + str.studly(attrLocal);

        // Carregar model estrangeiro 
        var est = await model[method]();
        if (!est) {
            return null;
        }

        return est[attrDestino];
    };


    Model.prototype.touch = async function () {
        // Carregar atributos
        var attrs = this.constructor.rawAttributes;
        var ids = Object.keys(attrs);
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var attr = attrs[id];

            if (!attr.herdar) {
                continue;
            }

            this[id] = await __herdarAttribute(this, id, attr);
        }
    }
}