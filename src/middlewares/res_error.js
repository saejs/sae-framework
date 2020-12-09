
module.exports = () => {
    return (req, res, next) => {
        res.error = (msg, code) => {
            code = code ? code : 9000;

            var err = {
                error: {
                    message: (msg instanceof Error) ? msg.message : msg,
                    code: code
                }
            };
            
            res.json(err);
        }

        next();
    }
}