const Sequelize = require('sequelize');
const muttations = require('./datatypes/muttations');

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
            allowNull: true,

            references: {
                key: 'id',
                model: table
            }          
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo String.
     * @param {Number} len Largura maxima da string 
     * @param {*} opts 
     * @returns {Object}
     */
    string: (len = 255, opts = {}) => {
        var ret = {
            type: Sequelize.STRING(len),
            allowNull: true,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Inteiro.
     * @param {*} opts 
     * @returns {Object}
     */
    integer: (opts = {}) => {
        var ret = {
            type: Sequelize.INTEGER,
            allowNull: true,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Número.
     * @param {*} opts 
     * @returns {Object}
     */
    number: (opts = {}) => {
        var ret = {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true,
            get(nome) {
                return muttations.number.get(this, nome);
            }
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Lógico.
     * @param {*} opts 
     * @returns {Object}
     */
    boolean: (opts = {}) => {
        var ret = {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Data e Hora.
     * @param {*} opts 
     * @returns {Object}
     */
    dateTime: (opts = {}, migration = false) => {
        if (typeof opts == 'boolean') {
            migration = opts;
            opts = {};
        }

        var ret = {
            type: Sequelize.DATE,
            allowNull: true,
            set(value, name) {
                muttations.date.set(this, name, value, 'yyyy-MM-dd hh:mm:ss');
            }
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Data.
     * @param {*} opts 
     * @returns {Object}
     */
    date: (opts = {}, migration = false) => {
        if (typeof opts == 'boolean') {
            migration = opts;
            opts = {};
        }
        
        var ret = {
            type: Sequelize.DATEONLY,
            allowNull: true,
            set(value, name) {
                muttations.date.set(this, name, value, 'yyyy-MM-dd');
            }
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Texto.
     * @param {*} opts 
     * @returns {Object}
     */
    text: (opts = {}) => {
        var ret = {
            type: Sequelize.TEXT,
            allowNull: true,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo Enum
     * @param {Array} values Lista de opções 
     * @param {*} opts 
     * @returns {Object}
     */
    enum: (values, opts = {}) => {
        var ret = {
            type: Sequelize.ENUM,
            values : values,
            allowNull: true,
        };

        Object.assign(ret, opts);

        return ret;
    },


    /**
     * Add campo Password.
     * @param {*} opts 
     * @returns {Object}
     */
    password: (opts = {}) => {
        var ret = {
            type: Sequelize.PASSWORD,
            allowNull: true,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo JSON.
     * @param {*} opts 
     * @returns {Object}
     */
    json: (opts = {}) => {
        var ret = {
            type: Sequelize.JSON,
            allowNull: true,
        };

        Object.assign(ret, opts);

        return ret;
    },

    /**
     * Add campo VIRTUAL.
     * @param {*} opts 
     * @returns {Object}
     */
    virtual: (opts = {}) => {
        var ret = {
            type: Sequelize.VIRTUAL,
        };

        Object.assign(ret, opts);

        return ret;
    },
};