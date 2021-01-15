const ApiError = require('../api_error');

module.exports = () => {
    return (req, res, next) => {
        res.error = (id, data = {}) => {

            var ret = {};

            // Verificar se ja foi informado um ID como uma classe ApiError
            if ((typeof id == 'object') && (id.constructor.name == 'ApiError')) {
                ret.error = id;
            } else {
                ret.error = new ApiError(id, data);
            }
           
            res.json(ret);
        }

        next();
    }
}