
module.exports = () => {
    return (req, res, next) => {
        res.__json = res.json;

        res.json = (obj) => {

            //obj = this.$prepareObjectToJson(obj);

            res.set('Content-Type',  'application/json');
            res.set('Cache-Control', 'no-cache');
            res.__json(obj);
        };

        next();
    }
}