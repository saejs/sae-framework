const { Op } = require("sequelize");
const ApiError = require('../../api_error');

class Query
{
    constructor (model) {
        this._model = model;
        this._query = {};
    }

    /**
     * Carregar lista de registros.
     * 
     * @returns {Array|Model}
     */
    async get() {
        return await this._model.findAll(this._query);
    }

    /**
     * Alias para carregar lista de registros.
     * 
     * @returns {Array|Model}
     */
    async all() {
        return await this.get();
    }

    /**
     * Carregar um unico registro.
     * 
     * @returns {Object|Model}
     */
    async first() {
        this.limit(1).offset(0);

        return await this._model.findOne(this._query);
    }

    /**
     * Atualizar registro pela seleção.
     * 
     * @returns {Object}
     */
    async update(attrs) {
        var opts = {};
        if (this._query.where) {
            opts.where = this._query.where;
        }

        return await this._model.update(attrs, opts);
    }

    /**
     * Excluir regitros pela seleção.
     * 
     * @returns {Object}
     */
    async destroy() {
        var opts = {};
        if (this._query.where) {
            opts.where = this._query.where;
        }

        return await this._model.destroy(opts);
    }

    /**
     * Adicionar uma subquery AND.
     * 
     * @param {Function} callback Callback do subquery
     * @returns {Query}
     */
    and(callback) {
        var subquery = new Query(this._model);

        // Executar callback
        callback.apply(null, [subquery]);

        // Verificar se where foi definido
        if (!this._query.where) {
            this._query.where = [];
        }

        //this._query.where[Op.and] = subquery._query.where;
        this._query.where.push({ [Op.and]: subquery._query.where });

        return this;
    }

    /**
     * Adicionar uma subquery OR.
     * 
     * @param {Function} callback Callback do subquery
     * @returns {Query}
     */
     or(callback) {
        var subquery = new Query(this._model);

        // Executar callback
        callback.apply(null, [subquery]);

        // Verificar se where foi definido
        if (!this._query.where) {
            this._query.where = [];
        }

        this._query.where.push({ [Op.or]: subquery._query.where });

        return this;
    }

    /**
     * Adicionar clausula where.
     * 
     * @param {string} attr Nome do atributo
     * @param {string} op Operador
     * @param {object|string|number} value Valor do filtro
     * @returns {Query}
     */
    where(attr, op, value = null) {

        // Verificar se eh um callback
        if (typeof attr == 'function') {
            return this.and(attr);
        }
        
        // Verificar se where foi definido
        if (!this._query.where) {
            this._query.where = [];
        }

        // Tratar entrada de parametros
        if (value === null) {
            value = op;
            op = '=';
        }

        var item = {};
        switch (op) {
            case '=':
                item[attr] = {
                    [Op.eq]: value,
                }
                break;

            case '<>':
                item[attr] = {
                    [Op.ne]: value,
                }
                break;

            case '>':
                item[attr] = {
                    [Op.gt]: value,
                }
                break;

            case '>=':
                item[attr] = {
                    [Op.gte]: value,
                }
                break;

            case '<':
                item[attr] = {
                    [Op.lt]: value,
                }
                break;

            case '<=':
                item[attr] = {
                    [Op.lte]: value,
                }
                break;

            case 'like':
                item[attr] = {
                    [Op.like]: value,
                }
                break;

            case 'notlike':
                item[attr] = {
                    [Op.notLike]: value,
                }
                break;

            case 'between':
                item[attr] = {
                    [Op.between]: value,
                }
                break;

            case 'notbetween':
                item[attr] = {
                    [Op.notBetween]: value,
                }
                break;

            case 'isnull':
                item[attr] = {
                    [Op.is]: null,
                }
                break;

            case 'isnotnull':
                item[attr] = {
                    [Op.not]: null,
                }
                break;

            case 'in':
                item[attr] = {
                    [Op.in]: value,
                }
                break;

            case 'notin':
                item[attr] = {
                    [Op.notIn]: value,
                }
                break;

            default:
                throw new ApiError('erro.query.op.nao.implementado', { op });
        }

        this._query.where.push(item);

        return this;
    }

    /**
     * Alias is null.
     * 
     * @param {string} attr Nome do atributo
     * @returns {Query}
     */
    whereNull(attr) {
        return this.where(attr, 'isnull', false);
    }

    /**
     * Alias is not null.
     * 
     * @param {string} attr Nome do atributo
     * @returns {Query}
     */
    whereNotNull(attr) {
        return this.where(attr, 'isnotnull', false);
    }

    /**
     * Alias in.
     * 
     * @param {string} attr Nome do atributo
     * @param {Array} values Lista de valores
     * @returns {Query}
     */
    whereIn(attr, values) {
        return this.where(attr, 'in', values);
    }

    /**
     * Alias not in.
     * 
     * @param {string} attr Nome do atributo
     * @param {Array} values Lista de valores
     * @returns {Query}
     */
    whereNotIn(attr, values) {
        return this.where(attr, 'notin', values);
    }

    /**
     * Adicionar um order by.
     * 
     * @param {string} attr Nome do atributo
     * @param {string} dir Direção da ordenação ASC ou DESC
     * @returns {Query}
     */
    orderBy(attr, dir = 'ASC') {
        if (!this._query.order) {
            this._query.order = [];
        }

        this._query.order.push([ attr, dir.toUpperCase() ]);

        return this;
    }
    
    /**
     * Adicionar o limit.
     * 
     * @param {Number} value Valor do limit
     * @returns {Query}
     */
    limit(value) {
        this._query.limit = value;

        return this;
    }

    /**
     * Adicionar o offset.
     * 
     * @param {Number} value Valor do offset
     * @returns {Query}
     */
    offset(value) {
        this._query.offset = value;

        return this;
    }

    /**
     * Adicionar includes.
     * 
     * @param {Object} model Model do include
     * @returns {Query}
     */
    include(model) {
        if (!this._query.include) {
            this._query.include = [];
        }

        this._query.include.push(model);

        return this;
    }
}

module.exports = Query;