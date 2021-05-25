const arr = require('rhinojs/support/arr');

module.exports = () => {
    return (req, res, next) => {

        // Add get query
        req.__query = req.query;
        req.query = (key, defValue = null) => {
            return arr.get(req.__query, key, defValue);
        };

        // Add get param
        req.param = (key, defValue = null) => {
            return arr.get(req.params, key, defValue);
        };

        // Add get json
        req.json = (key, defValue = null) => {
            return arr.get(req.body, key, defValue);
        };
        
        next();
    }
}