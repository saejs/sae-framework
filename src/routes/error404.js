module.exports = (app) => {
    app.$route.all('*', (req, res) => {
        res.error('erro.http.recurso.nao.encontrado');
    });
}