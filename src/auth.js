const ApiError = require("./api_error");

class Auth
{
    constructor() {
        this.$app = null;
        this.$user = null;
        this.$callgettoken = null;
    }

    /**
     * Carregar usuário pelo token.
     * 
     * @param {string} token Token do usuario
     * @returns {boolean}
     */
    async load(token) {
        if (!this.$callgettoken) {
            throw new ApiError('erro.auth.load.call.nao.definido');
        }

        // Carregar usuario pelo token
        var user = await this.$callgettoken(token);
        this.setUser(user);

        // Verificar se deve disparar o evento de acesso pelo token
        if (user != null) {
            this.$app.events.emit('event.usuario.acesso', user, token);
        }

        return (user != null);
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
     * Verificar se um usuario esta logado.
     * @returns {boolean}
     */
    check() {
        return (this.$user != null);
    }

    /**
     * Retorna o objeto do usuario logado
     * @returns {object|null}
     */
    user() {
        if (!this.check()) {
            return null;
        }

        return this.$user;
    }

    /**
     * Setar object user.
     * @param {Object} user 
     * @returns {Auth}
     */
    setUser(user) {
        this.$user = user;

        return this;
    }

    /**
     * Carregar contexto do usuário pelo token.
     * 
     * @param {Function} callback Função callback para carregar usuário
     * @returns {Auth}
     */
    setCallGetToken(callback) {
        this.$callgettoken = callback;

        return this;
    }
}

module.exports = new Auth();