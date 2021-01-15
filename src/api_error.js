class ApiError
{
    /**
     * Construtor da classe de erro.
     * 
     * @param {string} id ID da mensagem de erro
     * @param {Object} data Objeto com os parametros da mensagem
     */
    constructor(id, data = {})
    {
        this.id = id;
        this.data = data;
    }
}

module.exports = ApiError;