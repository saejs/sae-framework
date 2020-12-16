const Table = require('./table');
const arr = require("@rhinojs/support/src/arr");

class Schema
{
    /**
     * Construtor.
     * @param {Object} queryInterface Schema do sequelize
     */
    constructor(queryInterface)
    {
        this.queryInterface = queryInterface;
    }

    /**
     * Criar uma tabela no banco.
     * @param {String} tableName Nome da tabela
     * @param {Function} cb Callback para definição dos campos.
     */
    async createTable(tableName, cb)
    {
        // Criar builder da tabela
        var table = new Table(tableName);        
        await cb(table);

        // Executar no sequelize
        var attrs = {};
        arr.each(table.$attrs, (i, attr) => {
            attrs[attr.name] = attr.toSequelizeObject();
        });

        await this.queryInterface.createTable(table.name, attrs, {});
    }

    /**
     * Excluir tabela no banco.
     * @param {String} tableName Nome da tabela
     */
    async dropTable(tableName)
    {
        await this.queryInterface.dropTable(tableName);
    }
}

module.exports = Schema;