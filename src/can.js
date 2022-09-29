const ApiError = require("./api_error");
const arr = require('rhinojs/support/arr');

class Can
{
    constructor() {
        this.$app = null;
        this.$callgetcan = null;
        this.$cache = {};
    }

    /**
     * Verificar permissao.
     * 
     * @param {string} permissao
     * @returns {boolean}
     */
    async check(permissao) {
        if (!this.$callgetcan) {
            throw new ApiError('erro.auth.can_call_nao_definido');
        }

        // Verificar no cache
        if (arr.exists(this.$cache, permissao)) {
            return this.$cache[permissao];
        }

        // Carregar usuario pelo token
        var aut = await this.$callgetcan(permissao);

        // Guardar no cache
        this.$cache[permissao] = aut;

        return aut;
    }

    /**
     * Montar objeto da middlware can.
     * 
     * @param {string} regra ID da permissao
     * @returns {object}
     */
    make(regra) {
        return {
            id: 'can',
            regra,
        }
    }

    /**
     * Setar objeto app.
     * 
     * @param {Object} app 
     * @returns {Auth}
     */
    setApp(app) {
        this.$app = app;

        return this;
    }

    /**
     * Limpar o cache
     */
    clearCache() {
        this.$cache = {};
    }
    /**
     * Setar a funçao de verificação.
     * 
     * @param {Function} callback Função callback para verificar permissao
     * @returns {Can}
     */
    setCallGetCan(callback) {
        this.$callgetcan = callback;

        return this;
    }
}

module.exports = new Can();