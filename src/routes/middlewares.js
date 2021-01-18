class Middlewares
{
    constructor() {
        this.list = {};
    }

    /**
     * Registrar um novo middleware.
     * 
     * @param {string} id ID do middleware para usar nas rotas
     * @param {Function} callback Função do callback
     */
    register(id, callback) {
        this.list[id] = callback;
    }

    /**
     * Verificar se o id do middleware existe.
     * 
     * @param {string} id ID do middleware
     * @returns {boolean}
     */
    exists(id) {
        return (this.list[id] != null);
    }

    /**
     * Retorna um middleware pelo ID.
     * 
     * @param {string} id ID do middleware
     * @returns {Function}
     */
    get(id) {
        if (!this.exists(id)) {
            return null;
        }

        return this.list[id];
    }

    getAll(ids) {
        var rets = [];

        // Verificar se middleware esta registrado e montar lista.
        for (var i = 0; i < ids.length; i++) {
            var middleware = this.get(ids[i]);
            if (middleware) {
                rets.push(middleware);
            }
        }

        return rets;
    }
}

module.exports = Middlewares;