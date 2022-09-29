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
            // Verificar se id do middleware eh uma funcao
            if (typeof ids[i] == 'function') {
                rets.push(ids[i]);
            }

            // Verificar se id do middleware eh um objeto
            if (typeof ids[i] == 'object') {
                var obj = ids[i];
                var middleware = this.get(obj.id);
                if (middleware) {
                    rets.push(async function (req, res, next) {
                        await middleware(req, res, next, obj);
                    });
                }
            }

            // Verificar se id do middleware eh uma string
            if (typeof ids[i] == 'string') {
                var middleware = this.get(ids[i]);
                if (middleware) {
                    rets.push(middleware);
                }
            }
        }

        return rets;
    }
}

module.exports = Middlewares;