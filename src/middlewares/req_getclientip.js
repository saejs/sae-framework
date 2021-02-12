
module.exports = () => {
    return (req, res, next) => {

        req.getClientIp = () => {
            var ip = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
            var ips = ip.trim().split(',');

            /*
            var exp = /([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)+/;
            var match = exp.exec(ip);
            if (!match) {
                return null;
            }

            return match[1];
            */

            return ips[0].trim();
        };
        
        next();
    }
}