const Query = require('../query');

module.exports = (Model) => {

    Model.query = function () {
        return new Query(Model);
    }
    
}