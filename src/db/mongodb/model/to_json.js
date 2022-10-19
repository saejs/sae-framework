const arr = require('rhinojs/support/arr');

module.exports = (schemaModel, opts) => {

    const __transformJson = (model, ret) => {
        // Carregar dados originais
        var values = Object.assign({}, ret);

        // Verificar se foi definido os hiddens
        var hiddens = schemaModel.get('hiddens');
        if (hiddens && (typeof hiddens == 'object') && (hiddens.length > 0)) {
            values = arr.except(values, hiddens);
        }

        // Tratar ordem pela definição
        var ordenados = {
            id: ret.id
        };

        var attrs = Object.keys(schemaModel.obj);
        for (var attr of attrs) {
            if (arr.exists(values, attr)) {
                ordenados[attr] = values[attr];
                delete values[attr];
            }
        }

        // Verificar se ficou algum nao ordenado
        ordenados = Object.assign({}, ordenados, values);

        return ordenados;
    };

    schemaModel.set('hiddens', []);

    schemaModel.set('toJSON', {
        getters: true,
        transform: __transformJson,
    });

}