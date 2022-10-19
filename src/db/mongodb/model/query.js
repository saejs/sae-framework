const Query = require('../query');

module.exports = (schemaModel, opts) => {

    schemaModel.static('query', function() {
        return new Query(this);
    });
    
}