const fs = require('fs');
const path = require('path');

module.exports = {
    getSequelizeConfig : (withEnv = false) => {
        const fileConfig = path.resolve(process.cwd(), '.sequelizerc');
        const env = process.env.NODE_ENV || 'development';
        
        if (!fs.existsSync(fileConfig)) {
            return false;
        }

        var ret = require(fileConfig);
        ret.database = {};

        // Carregar config do database
        if (!fs.existsSync(ret.config)) {
            return false;
        }

        ret.database = require(ret.config);

        if (withEnv) {
            return ret.database[env];
        }

        return ret;
    },
};