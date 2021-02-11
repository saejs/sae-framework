
module.exports = () => {
    return (req, res, next) => {

        req.getClientIp = () => {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            /*
            var exp = /([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)+/;
            var match = exp.exec(ip);
            if (!match) {
                return null;
            }

            return match[1];
            */

            return ip;
        };
        
        next();
    }
}