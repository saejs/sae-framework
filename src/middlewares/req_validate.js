const Validator = require('../validator');

module.exports = () => {
    return (req, res, next) => {

        req.validate = async (rules) => {
            await Validator.falhas(req.body, rules);
        };
        
        next();
    }
}