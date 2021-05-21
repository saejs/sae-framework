
module.exports = (app) => {
    return async (req, res, next) => {

        // Executar eventos prepare
        await app.events.emit('route.prepare', req, res, next);

        // Continuar fluxo
        next();
    }
}