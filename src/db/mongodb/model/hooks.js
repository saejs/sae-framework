var eventos = [
    { method: 'pre',  evento: 'init' },
    { method: 'post', evento: 'init' },
    { method: 'pre',  evento: 'validate' },
    { method: 'post', evento: 'validate' },
    { method: 'pre',  evento: 'save' },
    { method: 'post', evento: 'save' },
    { method: 'pre',  evento: 'remove' },
    { method: 'post', evento: 'remove' },
];

module.exports = (schemaModel, opts) => {
    // Verificar se os hooks foram definidos.
    if (!opts.hooks) {
        return;
    }

    // Tratar eventos e registrar no schema
    for (var i = 0; i < eventos.length; i++) {
        var ev = eventos[i];

        if (typeof opts.hooks[ev.evento] == 'function') {
            schemaModel[ev.method](ev.evento, opts.hooks[ev.evento]);
        }
    }
}