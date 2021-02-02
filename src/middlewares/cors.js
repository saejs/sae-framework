
module.exports = () => {
    return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin',    '*');
        res.setHeader('Access-Control-Allow-Methods',   '*');
        res.setHeader('Access-Control-Request-Headers', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
        res.setHeader('Access-Control-Request-Method',  'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');

        next();
    }
}