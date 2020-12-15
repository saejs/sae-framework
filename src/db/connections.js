'use strict';

const connectionStringParter = (stringConnection) => {
    var re = new RegExp("^([a-zA-Z0-9_-]+){1}@([a-zA-Z0-9_\\.-]+){1}\\/([a-zA-Z0-9_]+){1}:(.+){1}(!?:([0-9]+){1})*$");
    var info = re.exec(stringConnection);
    if (!info) {
        return false;
    }

    return {
        database : info[1],
        host     : info[2],
        username : info[3],
        password : info[4],
        port     : info[6] ? info[6] : 3306,
    };
};

module.exports = {
    connectionStringParter 
};