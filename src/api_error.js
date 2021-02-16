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
        if (typeof id == 'object') {
            var id_tratado = this.__checkErrorMapeados(id, data);
            if (id_tratado) {
                id = id_tratado;                
            } else {
                data.message = id;
                id = 'erro.nao.mapeado';
            }
        }

        // Verificar strings
        if ((typeof id != 'string') || ((typeof id == 'string') && (id.substr(0, 5) != 'erro.'))) {
            Object.assign(data, { message: id });
            id = 'erro.nao.mapeado';
        }
        
        this.id = id;
        this.data = data;
    }

    __checkErrorMapeados(err, data) {
        if (!(err instanceof Error)) {
            return false;
        }

        data.class = err.constructor.name;

        // Verificar se UniqueConstraintError do sequelize
        if (err.constructor.name == 'UniqueConstraintError') {
            data.fields = err.fields;
            return 'erro.db.atributo.unico';
        }

        // Verificar se DatabaseError do sequelize
        if (err.constructor.name == 'DatabaseError') {
            data.message = err.message;
            data.sql     = err.sql;
            return 'erro.db.sql';
        }

        // Verificar se ValidationError do sequelize
        if (err.constructor.name == 'ValidationError') {
            data.message = err.message;       
            data.errors = err.errors.map((item) => {
                return {
                    attr   : item.path,
                    message: item.message
                };
            });
            return 'erro.db.atributo.validar';
        }

        data.message = err.message;       

        return 'erro.nao.mapeado';
    }
}

module.exports = ApiError;