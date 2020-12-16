const Sequelize = require('sequelize');
const Attribute = require('./attribute');

class Table
{
    /**
     * Contrutor da tabela.
     * @param {String} name Nome da tabela
     */
    constructor(name)
    {
        this.name    = name;
        this.$attrs  = [];
        //this.$indexs = [];
    }

    /**
     * Add campo ID.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    id(name = 'id')
    {
        var attr = new Attribute(Sequelize.STRING(36), name);
        attr.primaryKey();

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo String.
     * @param {String} name Nome do campo
     * @param {Number} len Quantidade caracteres.
     * @returns {Attribute}
     */
    string(name, len = 255)
    {
        var attr = new Attribute(Sequelize.STRING(len), name);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo Enum.
     * @param {String} name Nome do campo
     * @param {Object} values Valores do enum
     * @returns {Attribute}
     */
    enum(name, values)
    {
        var attr = new Attribute(Sequelize.ENUM, name);
        attr.values(values);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo Boolean.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    boolean(name)
    {
        var attr = new Attribute(Sequelize.BOOLEAN, name);
        attr.default(false);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo Inteiro.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    integer(name)
    {
        var attr = new Attribute(Sequelize.INTEGER, name);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo Numero.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    number(name)
    {
        var attr = new Attribute(Sequelize.DECIMAL(10, 5), name);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo data e hora.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    dateTime(name)
    {
        var attr = new Attribute(Sequelize.DATE, name);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo data.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    date(name)
    {
        var attr = new Attribute(Sequelize.DATEONLY, name);

        this.$attrs.push(attr);

        return attr;
    }

    /**
     * Add campo Texto.
     * @param {String} name Nome do campo
     * @returns {Attribute}
     */
    text(name)
    {
        var attr = new Attribute(Sequelize.TEXT, name);

        this.$attrs.push(attr);

        return attr;
    }
                                                                                                                                                                                                                                                                                                 
    /**
     * Add campo de associação.
     * @param {String} name Nome do campo
     * @param {String} table Nome da tabela estrangeira
     * @returns {Attribute}
     */
    association(name, table)
    {
        var attr = this.string(name, 36);
        attr.ref(table);

        return attr;
    }

    /**
     * Add campos de controle de created, updated
     * @param {String} createAt Nome do campo createdAt
     * @param {String} updatedAt Nome do campo updatedAt
     * @returns {Table}
     */
    timestamps(createAt = 'created_at', updatedAt = 'updated_at')
    {
        this.dateTime(createAt);

        this.dateTime(updatedAt);

        return this;
    }
}

module.exports = Table;