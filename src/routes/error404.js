module.exports = (app) => {
    app.$route.all('*', (req, res) => {
        res.error('Recurso nao encontrado', 404);
    });
}