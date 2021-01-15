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
        // Verificar se o ID inicia com o prexido de erro.
        if ((typeof id != 'string') || ((typeof id == 'string') && (id.substr(0, 5) != 'erro.'))) {
            Object.assign(data, { message: id });
            id = 'erro.nao.mapeado';
        }

        this.id = id;
        this.data = data;
    }
}

module.exports = ApiError;