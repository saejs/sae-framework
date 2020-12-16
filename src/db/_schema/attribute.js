class Attribute
{
    constructor(type, name)
    {
        this.type       = type;
        this.name       = name;

        this.opts       = {
            nullable: false,
        };
    }

    /**
     * Setar valor padrão.
     * @param {Object|String} value Valor padrão
     * @returns {Attribute}
     */
    default(value)
    {
        this.opts.default = value;

        return this;
    }

    /**
     * Marcar campo como possivel para nulo.
     * @param {Boolean} value Marcar campo como possivel para nulo.
     * @returns {Attribute}
     */
    nullable(value = true)
    {
        this.opts.nullable = value;

        return this;
    }

    /**
     * Marcar campo como primary key.
     * @returns {Attribute}
     */
    primaryKey()
    {
        this.opts.primaryKey = true;
        
        return this;
    }

    /**
     * Marcar campo como auto increment.
     * @returns {Attribute}
     */
    increment()
    {
        this.opts.increment = true;
        
        return this;
    }

    /**
     * Setar valores do campo ENUMs.
     * @param {Object} values Valores dos ENUMs
     * @returns {Attribute}
     */
    values(values)
    {
        this.opts.values = values;

        return this;
    }

    /**
     * Setar reference do campo.
     * @param {String} table Nome da tabela estrangeira.
     * @param {String} keyName Nome do campo key da tabela estrangeira
     * @returns {Attribute}
     */
    ref(table, keyName = 'id')
    {
        this.opts.references = {
            model : table,
            key   : keyName
        }

        return this;
    }

    /**
     * Setar alteração do campo após o campo informado.
     * @param {String} afterName Nome do campo
     * @returns {Attribute}
     */
    after(afterName)
    {
        this.opts.after = afterName;

        return this;
    }

    /**
     * Montar objeto para usar o sequelize.
     * @returns {Object}
     */
    toSequelizeObject()
    {
        var ret           = {};
        ret.type          = this.type;
        ret.allowNull     = this.opts.nullable;
        ret.primaryKey    = this.opts.primaryKey ? this.opts.primaryKey : false;
        ret.autoIncrement = this.opts.increment ? this.opts.increment : false;

        // Valores padrão
        if (this.opts.default) {
            ret.defaultValue = this.opts.default;
        }

        // Opções de valores (para os ENUMs)
        if (this.opts.values) {
            ret.values = this.opts.values;
        }

        // After
        if (this.opts.after) {
            ret.after = this.opts.after;
        }

        // Referencias
        if (this.opts.references) {
            ret.references = this.opts.references;
        }

        return ret;
    }
}

module.exports = Attribute;