
module.exports = () => {
    return (req, res, next) => {
        res.__json = res.json;

        res.json = (obj) => {

            //obj = this.$prepareObjectToJson(obj);

            res.set('Content-Type', 'application/json');
            res.__json(obj);
        };

        next();
    }
}