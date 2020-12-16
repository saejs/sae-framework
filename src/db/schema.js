const Sequelize = require('sequelize');

module.exports = {
    /**
     * Add campo ID.
     * @param {*} opts 
     * @returns {Object}
     */
    id : (opts = {}) => {
        var ret = {
            type: Sequelize.STRING(36),
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Association (lookup).
     * @param {String} table Nome da tabela estrangeira 
     * @param {*} opts 
     * @returns {Object}
     */
    association : (table, opts = {}) => {
        var ret = {
            type: Sequelize.STRING(36),

            references: {
                key: 'id',
                model: table
            }          
        };

        Object.assign(ret, opts);

        return ret;
    },

    enum: (values, opts = {}) => {
        var ret = {
            type: Sequelize.ENUM,
            values : values,
        };

        Object.assign(ret, opts);

        return ret;
    }
};