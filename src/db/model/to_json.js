const arr = require('rhinojs/support/arr');

module.exports = (Model) => {
    const __toJSON = Model.prototype.toJSON;
    Model.prototype.__toJSON = __toJSON;
    Model.prototype.toJSON = function () {

        // Verificar se deve carregar os valores originais ou pro uma regra
        if (typeof this.toCustomJSON == 'function') {
            return this.toCustomJSON.call(null, this);
        }

        // Carregar dados originais
        var values = Object.assign({}, this.get());

        // Tratar hiddens do model
        if (this.constructor.hiddens) {
            values = arr.except(values, this.constructor.hiddens);
        }

        // Tratar ordem pela definição
        var ordenados = {};
        var attrs = Object.keys(this.constructor.rawAttributes);
        for (var attr of attrs) {
            if (arr.exists(values, attr)) {
                ordenados[attr] = values[attr];
                delete values[attr];
            }
        }

        // Verificar se ficou algum nao ordenado
        ordenados = Object.assign({}, ordenados, values);

        return ordenados;
    }
}