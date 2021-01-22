const arr = require('rhinojs/support/arr');

module.exports = () => {
    return (req, res, next) => {

        req.json = (key, defValue = null) => {
            return arr.get(req.body, key, defValue);
        };
        
        next();
    }
}